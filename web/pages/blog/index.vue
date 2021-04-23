<template>
    <div class="blog">
        <AppBar />
        <v-container class="mt-5" :style="`max-width: ${thresholds.sm}px`">
            <v-card>
                <v-card-title>
                    {{ $t('pages.blog.blogList') }}
                </v-card-title>
                <div class="mx-5" style="display: flex; flex-wrap: wrap">
                    <div style="flex-grow: 1">
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            :label="$t('pages.blog.search')"
                            single-line
                            hide-details
                        />
                    </div>
                    <div class="ml-3" style="flex-grow: 1; width: 350px">
                        <v-select
                            v-model="categories"
                            :items="categoriesOptions"
                            :label="$t('pages.blog.categories.categories')"
                            multiple
                            hide-details
                        />
                    </div>
                </div>
                <v-data-table
                    class="mt-5"
                    :headers="headers"
                    :items="blogList"
                    :itemsPerPage="10"
                    item-key="_id"
                    hide-default-footer
                >
                    <template v-slot:body="{ items }">
                        <tbody>
                            <tr v-for="item in items" :key="item._id">
                                <td style="max-width: 200px">{{ item.title }}</td>
                                <td>{{ $dayjs(item.updatedDate).format('YYYY/MM/DD HH:mm') }}</td>
                                <td class="text-capitalize">{{ $t(`pages.common.${item.status}`) }}</td>
                                <td class="text-center">
                                     <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn @click="redirectToBlogViewingPage" :data-blog-id="item._id" v-bind="attrs" v-on="on" icon><v-icon>mdi-file-find</v-icon></v-btn>
                                        </template>
                                        {{ $t('pages.blog.viewBlog')  }}
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn @click="redirectToBlogEditPage" :data-blog-id="item._id" v-bind="attrs" v-on="on" icon><v-icon>mdi-pencil</v-icon></v-btn>
                                        </template>
                                        {{ $t('pages.blog.editBlog')  }}
                                    </v-tooltip>
                                </td>
                            </tr>
                            </tbody>
                    </template>
                </v-data-table>
                <v-pagination v-model="page" :length="pagination.totalPage" />
            </v-card>
        </v-container>
    </div>
</template>
<script>
    import * as _ from 'lodash';
    import categoriesList from '../../assets/enum/categoriesOptions.json';

    export default {
        async asyncData({ params, $axios, store, redirect, app }) {
            try {
                // get blogs
                let headers = null;
                if (store && store.state.authentication.jwt) {
                    headers = { Authorization: 'Bearer ' + store.state.authentication.jwt };
                } else {
                    // no authority
                    redirect(`/${app.i18n.locale}/auth/login`);
                }
                let response = await $axios.get( `${process.env.blogApi}/blogs/myBlogs?page=1&perPage=10`, { headers });
                const blogList = response.data.payload.blogList;
                const pagination = response.data.payload.pagination;

                return {
                    blogList, pagination
                }
            } catch (err) {
                redirect(`/${app.i18n.locale}/auth/login`);
            }
        },
        data() {
            return {
                thresholds: this.$vuetify.breakpoint.thresholds,
                search: '',
                categories: [],
                page: 1,
                categories: [],
                categoriesOptions: categoriesList.map(option => ({
                    value: option,
                    text: this.$t(`pages.blog.categories.${option}`)
                })),
                headers: [
                    {
                        text: this.$t('pages.blog.title'),
                        align: 'start',
                        sortable: false,
                        value: 'title',
                    },
                    {
                        text: this.$t('pages.blog.lastUpdateAt'),
                        align: 'start',
                        sortable: false,
                        value: 'updatedDate',
                    },
                    {
                        text: this.$t('pages.blog.status'),
                        align: 'start',
                        sortable: false,
                        value: 'status',
                    },
                    {
                        text: this.$t('pages.blog.viewOrEdit'),
                        align: 'center',
                        sortable: false,
                        value: '_id',
                    }
                ]
            }
        },
        watch: {
            page() {
                this.getBlogList();
            },
            categories() {
                this.getBlogList();
            },
            search: {
                handler: _.debounce(function() {
                    this.getBlogList()
                }, 300),
                immediate: false
            }
        },
        methods: {
            async getBlogList() {
                let postData = {
                    search: this.search,
                    page: this.page,
                    categories: this.categories
                }
                const { blogList, pagination } = await this.$store.dispatch('blog/searchBlog', postData);
                this.blogList = blogList;
                this.pagination = pagination;
            },
            redirectToBlogViewingPage(e) {
                const blogId = e.currentTarget.dataset.blogId;
                this.$router.push({
                    name: `blog-blogId___${this.$i18n.locale}`,
                    params: {
                        blogId
                    }
                });
            },
            redirectToBlogEditPage(e) {
                const blogId = e.currentTarget.dataset.blogId;
                this.$router.push({
                    name: `blog-blogId-edit___${this.$i18n.locale}`,
                    params: {
                        blogId
                    }
                });
            }
        },
        computed: {
            primaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'primary' : 'default';
            },
            secondaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'secondary' : 'primary';
            }
        },
        head() {
            return {
                title: this.$t('headers.manageBlogPage')
            }
        }
    }
</script>