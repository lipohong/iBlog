<template>
    <div class="blog">
        <SideBar :author="author" :selectedItem="0" :followList="followList" :blogsAmount="blogsAmount" />
        <div class="viewUserBlogsContainer">
            <main>
                <BlogSearchBar v-model="search" :searchFunction="getAuthorBlogList" />
                <div class="blogPreviewListContainer">
                    <LazyBlogPreview v-for="blog in blogList" :key="blog._id" :blog="blog" :author="author" :categoriesOptions="categoriesOptions" />
                </div>
                <v-sheet v-if="blogList.length === 0">
                    <v-container>
                        <div class="text-center">
                            {{ $t('pages.blog.noResult') }}
                        </div>
                    </v-container>
                </v-sheet>
                <v-pagination v-if="pagination.totalPage > 0" v-model="page" :length="pagination.totalPage"/>
            </main>
        </div>
    </div>
</template>
<script>
    import * as _ from 'lodash';
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
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false, uppercaseHeadings: false, ignoreHref: true, tags: { 'img': { format: 'skip' } } });
                    // limit length of title
                    blog.title = _.truncate(blog.title, { 'length': 50, 'omission': '...' });
                    // limit length of content
                    blog.content = _.truncate(blog.content, { 'length': 200, 'omission': '...'});

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
                ].reduce((accumulator, currentValue) => {
                    accumulator[currentValue] = this.$t(`pages.blog.categories.${currentValue}`);
                    return accumulator;
                }, {}),
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
        },
        watch: {
            page() {
                this.getAuthorBlogList();
            },
            categories() {
                this.getAuthorBlogList();
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
                title: this.$t('headers.authorBlogListPage')
            }
        }
    }
</script>