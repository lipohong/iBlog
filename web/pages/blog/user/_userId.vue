<template>
    <div class="blog">
        <v-container class="viewUserBlogsContainer" :style="`max-width: ${thresholds.sm}px`">
            <div style="display: flex; flex-wrap: wrap">
                <div class="ma-1" style="flex-grow: 1; width: 250px">
                    <v-card :color="secondaryColor" dark>
                        <v-card-title>
                            <v-avatar size="40" :color="specialColor">
                                <img v-if="author.userInfo.avatar" :src="author.userInfo.avatar" style="object-fit: cover">
                                <span class="white--text" v-else>{{ author.username[0] }}</span>
                            </v-avatar>
                            <div class="ma-2">
                                <div style="wordBreak: break-word">{{ author.username }}</div>
                            </div>
                        </v-card-title>

                        <v-card-text class="headline font-weight-bold">
                            <span v-if="author.userInfo.description">"{{ author.userInfo.description }}"</span>
                            <span v-else>"{{ $t('pages.blog.noDescriptionMessage') }}"</span>
                        </v-card-text>

                        <v-card-actions>
                            <v-list-item>
                                <div style="width: 100%; display: flex; justify-content: flex-end; align-items: center">
                                    <v-tooltip bottom v-if="$store.state.authentication.userId !== author._id">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn class="mr-4" @click="flowOrUnfollow" small icon v-bind="attrs" v-on="on">
                                                <v-icon v-if="followed">mdi-heart</v-icon>
                                                <v-icon v-else>mdi-heart-outline</v-icon>
                                            </v-btn>
                                        </template>
                                        {{ followed ? $t('pages.blog.unFollow') : $t('pages.blog.follow') }}
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <div v-bind="attrs" v-on="on">
                                                <v-icon class="mr-1">mdi-post</v-icon>
                                                <span class="subheading mr-4">{{ blogsAmount }}</span>
                                            </div>
                                        </template>
                                        {{ $t('pages.blog.blogsAmount') }}
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <div v-bind="attrs" v-on="on">
                                                <v-icon class="mr-1">mdi-account-group</v-icon>
                                                <span class="subheading">{{ followList.length }}</span>
                                            </div>
                                        </template>
                                        {{ $t('pages.blog.fans') }}
                                    </v-tooltip>
                                </div>
                            </v-list-item>
                        </v-card-actions>
                    </v-card>
                    <div class="mt-2">
                        <div>
                            <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                :label="$t('pages.blog.search')"
                                single-line
                                hide-details
                                outlined
                            />
                        </div>
                        <div class="mt-2">
                            <v-select
                                v-model="categories"
                                :items="categoriesOptions"
                                :label="$t('pages.blog.categories.categories')"
                                multiple
                                outlined
                                hide-details
                            />
                        </div>
                    </div>
                </div>
                <div class="ma-1" style="flex-grow: 3">
                    <v-sheet class="blogContainer mb-2" v-for="blog in blogList" :key="blog._id" elevation="1" @click="redirectToBlogViewingPage" :data-blog-id="blog._id">
                        <v-container>
                            <div style="display: flex">
                                <div>
                                    <v-avatar :color="secondaryColor" size="125" tile>
                                        <v-img v-if="blog.cover" :src="blog.cover"></v-img>
                                        <span class="white--text text-h3" v-else>{{ blog.title[0] }}</span>
                                    </v-avatar>
                                </div>
                                <div class="ml-2">
                                    <div class="text-h5">
                                        <span v-if="blog.cover" v-text="blog.title"/>
                                        <span v-else v-text="String(blog.title).slice(1)"/>
                                    </div>
                                    <div class="mt-1 body-1 text--secondary">
                                        <span v-text="blog.content"></span>
                                    </div>
                                    <div class="mt-1 caption text--secondary">
                                        {{ $t('pages.blog.lastUpdateAt') }} {{ dayjs(blog.updatedDate).format('YYYY-MM-DD HH:mm') }}
                                    </div>
                                    <div class="mt-1 body-2">
                                        <v-icon>mdi-eye-outline</v-icon>
                                        <span>{{ blog.viewed || 0 }}</span>
                                        <v-icon class="ml-2">mdi-comment-processing-outline</v-icon>
                                        <span>{{ blog.comments }}</span>
                                        <v-icon class="ml-2">mdi-heart-outline</v-icon>
                                        <span>{{ blog.likes }}</span>
                                    </div>
                                </div>
                            </div>
                        </v-container>
                    </v-sheet>
                    <v-sheet v-if="blogList.length === 0">
                        <v-container>
                            <div class="text-center">
                                {{ $t('pages.blog.noResult') }}
                            </div>
                        </v-container>
                    </v-sheet>
                    <v-pagination v-if="pagination.totalPage > 0" class="mt-5" v-model="page" :length="pagination.totalPage"/>
                </div>
            </div>
        </v-container>
    </div>
</template>
<script>
    import * as _ from 'lodash';
    const dayjs = require('dayjs');
    const htmlToText = require('html-to-text');

    export default {
        async asyncData({ params, $axios, redirect, app }) {
            try {
                // get author info
                let response = await $axios.get(`${process.env.userApi}/users/${params.userId}`);
                const author = response.data.payload;
                // get author's fans
                response = await $axios.get(`${process.env.userApi}/follows/${params.userId}/fans`);
                const { followList } = response.data.payload;
                // get author's blogs
                response = await $axios.get(`${process.env.blogApi}/blogs/user/${params.userId}?page=1&perPage=10`);
                let { blogList, pagination } = response.data.payload;
                blogList = blogList.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false, uppercaseHeadings: false });
                    // limit length of title
                    blog.title = _.truncate(blog.title, { 'length': 50 });
                    // limit length of content
                    blog.content = _.truncate(blog.content, { 'length': 30 });

                    return blog
                })
                // get author blogs amount
                response = await $axios.get(`${process.env.blogApi}/blogs/user/${params.userId}/amount`);
                const { amount } = response.data.payload;
                const blogsAmount = amount;

                return {
                    author, followList, blogList, pagination, blogsAmount
                }
            } catch (err) {
                redirect(`/${app.i18n.locale}/auth/login`);
            }
        },
        data() {
            return {
                dayjs,
                thresholds: this.$vuetify.breakpoint.thresholds,
                page: 1,
                categories: [],
                categoriesOptions: [
                    'dataStructure',
                    'algorithm',
                    'designPattern',
                    'programming',
                    'frontend',
                    'html',
                    'css',
                    'js',
                    'ts',
                    'jest',
                    'framework',
                    'UIlibrary',
                    'backend',
                    'devOps',
                    'networking',
                    'life',
                    'other'
                ].map(option => ({
                    value: option,
                    text: this.$t(`pages.blog.categories.${option}`)
                })),
                search: ''
            }
        },
        methods: {
            async getAuthorBlogList() {
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    let postData = {
                        search: this.search,
                        page: this.page,
                        categories: this.categories,
                        userId: this.$route.params.userId
                    }
                    let { blogList, pagination } = await this.$store.dispatch('blog/searchAuthorBlog', postData);
                    blogList = blogList.map(blog => {
                        // conver html to plain string
                        blog.content = htmlToText.fromString(blog.content, { wordwrap: false });

                        return blog
                    })
                    this.blogList = blogList;
                    this.pagination = pagination;
                } catch (err) {
                    // show error message
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar:{
                            open: true,
                            color: 'error',
                            message: this.$t(`messages.common.unknownError`)
                        }
                    });
                }
                this.$store.dispatch('global/setProgressBar', { progressBar: false });
            },
            async getAuthorFans() {
                try {
                    const response = await this.$axios.get(`${process.env.userApi}/follows/${this.$route.params.userId}/fans`);
                    const { followList } = response.data.payload;

                    this.followList = followList;
                } catch (err) {
                    // show error message
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar:{
                            open: true,
                            color: 'error',
                            message: this.$t(`messages.common.unknownError`)
                        }
                    });
                }
            },
            async flowOrUnfollow() {
                if (!this.$store.state.authentication.jwt) {
                    this.$router.push({
                        name: `auth-login___${this.$i18n.locale}`,
                        query: {
                            from: this.$route.path
                        }
                    });

                    return
                }
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    await this.$axios.post(`${process.env.userApi}/follows/${this.$route.params.userId}`);
                    await this.getAuthorFans();
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar:{
                            open: true,
                            color: 'success',
                            message: this.followed ? this.$t(`messages.blog.general.followSuccess`) : this.$t(`messages.blog.general.unFollowSuccess`)
                        }
                    });
                } catch (err) {
                    // show error message
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar:{
                            open: true,
                            color: 'error',
                            message: this.$t(`messages.common.unknownError`)
                        }
                    });
                }
                this.$store.dispatch('global/setProgressBar', { progressBar: false });
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
        },
        watch: {
            page() {
                this.getAuthorBlogList();
            },
            categories() {
                this.getAuthorBlogList();
            },
            search: {
                handler: _.debounce(function() {
                    this.getAuthorBlogList()
                }, 300),
                immediate: false
            }
        },
        computed: {
            primaryColor() {

                return this.$store.state.mode.mode === 'light' ? 'primary' : 'default';
            },
            specialColor() {

                return this.$store.state.mode.mode === 'light' ? 'primary' : '#aaa';
            },
            secondaryColor() {

                return this.$store.state.mode.mode === 'light' ? 'secondary' : 'primary';
            },
            followed() {

                return _.findIndex(this.followList, { userId: this.$store.state.authentication.userId }) !== -1;
            }
        },
        head() {
            return {
                title: this.$t('headers.authorProfilePage')
            }
        }
    }
</script>