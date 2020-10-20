<template>
    <div class="blog mt-5 mb-10">
        <v-container class="viewBlogContainer" :style="`max-width: ${thresholds.sm}px`">
            <v-card>
                <v-card-title>
                    Blog List
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    />
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="blogList"
                    :itemsPerPage="10"
                    item-key="_id"
                    hide-default-footer
                >
                    <template v-slot:body="{ items }">
                        <tbody>
                            <tr v-for="item in items" :key="item._id">
                                <td>{{ item.title }}</td>
                                <td>{{ dayjs(item.updatedDate).format('YYYY/MM/DD HH:mm') }}</td>
                                <td class="text-capitalize">{{ item.status }}</td>
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
                <v-pagination
                    v-model="page"
                    :length="pagination.totalPage"
                />
            </v-card>
        </v-container>
    </div>
</template>
<script>
    const dayjs = require('dayjs');

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
                dayjs,
                thresholds: this.$vuetify.breakpoint.thresholds,
                search: '',
                categories: [],
                page: 1,
                headers: [
                    {
                        text: 'Title',
                        align: 'start',
                        sortable: false,
                        value: 'title',
                    },
                    {
                        text: 'Last Update At',
                        align: 'start',
                        sortable: false,
                        value: 'updatedDate',
                    },
                    {
                        text: 'Status',
                        align: 'start',
                        sortable: false,
                        value: 'status',
                    },
                    {
                        text: 'View / Edit Blog',
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
            }
        },
        methods: {
            async getBlogList() {
                let postData = {
                    search: this.search,
                    page: this.page,
                    categories: this.categories
                }
                const blogList = await this.$store.dispatch('blog/searchBlog', postData);
                this.blogList = blogList;
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