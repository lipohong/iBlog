<template>
    <div class="home">
        <AppBar />
        <section class="bannerContainer">
            <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg">
                <header>{{ $t('pages.home.shareWithIBlog') }}</header>
                <main>{{ $t('pages.home.description') }}</main>
                <footer v-if="!$store.state.user.user._id">
                    <span @click="redirectToLogin">
                        {{ $t('pages.home.login') }}
                    </span> | 
                    <span @click="redirectToBlogCreate">
                        {{ $t('pages.home.postBlog') }}
                    </span> | 
                    <span @click="redirectToRegister">
                        {{ $t('pages.home.register') }}
                    </span>
                </footer>
            </v-parallax>
        </section>
        <v-container :style="`max-width: ${thresholds.md}px`">
            <section>
                <header class="caption">
                    <h1>{{ $t('pages.home.recommendedBlogs') }}</h1>
                    <v-progress-linear class="separateBar" value="100" :color="secondaryColor"></v-progress-linear>
                </header>
                <main class="recommendBlogsContainer">
                    <div class="firstContainer">
                        <BlogRecommendTile :blog="recommendedBLogList[0]" />
                    </div>
                    <div class="secondContainer">
                        <BlogRecommendTile :blog="recommendedBLogList[1]" />
                        <BlogRecommendTile :blog="recommendedBLogList[2]" />
                    </div>
                </main>
            </section>
            <section>
                <header class="caption">
                    <h1>{{ $t('pages.home.popularBlogs') }}</h1>
                    <v-progress-linear class="separateBar" value="100" :color="secondaryColor"></v-progress-linear>
                </header>
                <main class="popularBlogsContainer">
                    <div class="popularBlogsListContainer">
                        <BlogPopularAndTrandingTile v-for="blog in top5LikedBlogs" :key="blog._id" :blog="blog" :categoriesOptions="categoriesOptions" />
                        <div class="adContainer">
                            <v-sheet class="adImage" :color="secondaryColor">
                                <p>ad image</p>
                            </v-sheet>
                            <div class="adText">
                                <p>ad</p>
                            </div>
                        </div>
                    </div>
                    <aside>
                        <p>ad banner</p>
                    </aside>
                </main>
            </section>
            <section>
                <header class="caption">
                    <h1>{{ $t('pages.home.trendingBlogs') }}</h1>
                    <v-progress-linear class="separateBar" value="100" :color="secondaryColor"></v-progress-linear>
                </header>
                <main class="trendingBlogsContainer">
                    <div class="trendingBlogsListContainer">
                        <BlogPopularAndTrandingTile v-for="blog in top5CommentedBlogs" :key="blog._id" :blog="blog" :categoriesOptions="categoriesOptions" />
                        <div class="adContainer">
                            <v-sheet class="adImage" :color="secondaryColor">
                                <p>ad image</p>
                            </v-sheet>
                            <div class="adText">
                                <p>ad</p>
                            </div>
                        </div>
                    </div>
                </main>
            </section>
            <section>
                <header class="caption">
                    <h1>{{ $t('pages.home.allRecentBlogs') }}</h1>
                    <v-progress-linear class="separateBar" value="100" :color="secondaryColor"></v-progress-linear>
                </header>
                <BlogSearchBar @inputChange="handleInputChange" :searchFunction="searchBlogs" />
                <div v-if="latestBlogs && latestBlogs.blogList.length > 0" class="blogListContainer">
                    <LazyBlogPreview v-for="blog in latestBlogs.blogList" :key="blog._id" :blog="blog" :categoriesOptions="categoriesOptions" />
                    <div class="mt-10 text-center" v-if="loadingLatestBlogs">
                        <v-progress-circular indeterminate :color="primaryColor"></v-progress-circular>
                    </div>
                </div>
                <div v-else>{{ $t('pages.blog.noResult') }}</div>
                <footer class="loadBlogContainer" v-if="latestBlogs.pagination.totalPage > latestBlogs.pagination.currentPage">
                    <v-sheet class="loadBlogButton" :color="primaryColor" dark @click="loadMoreBlogs">{{ $t('pages.home.loadMoreBlogs') }}</v-sheet>
                </footer>
            </section>
        </v-container>
    </div>
</template>
<script>
    import * as _ from 'lodash';
    import categories from '../assets/enum/categoriesOptions.json';
    const htmlToText = require('html-to-text');

    export default {
        async asyncData({ $axios }) {
            try {
                // get recommended blogs
                let response = await $axios.get(`${process.env.blogApi}/blogs?isRecommended=true`);
                const recommendedBLogList = response.data.payload.blogList;

                // get top 5 commented blogs
                response = await $axios.get(`${process.env.commentApi}/comments/blogs/top5`);
                let top5CommentedBlogs = response.data.payload;
                top5CommentedBlogs = top5CommentedBlogs.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false, uppercaseHeadings: false, ignoreHref: true, tags: { 'img': { format: 'skip' } } });
                    // limit length of title
                    blog.title = _.truncate(blog.title, { 'length': 25, 'omission': '...' });

                    return blog
                })
                // get top 5 liked blogs
                response = await $axios.get(`${process.env.commentApi}/likes/blogs/top5`);
                let top5LikedBlogs = response.data.payload;
                top5LikedBlogs = top5LikedBlogs.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false, uppercaseHeadings: false, ignoreHref: true, tags: { 'img': { format: 'skip' } } });
                    // limit length of title
                    blog.title = _.truncate(blog.title, { 'length': 25, 'omission': '...' });

                    return blog
                })
                // get latest 10 blogs
                response = await $axios.get(`${process.env.blogApi}/blogs?page=1&perPage=10`);
                let latestBlogs = response.data.payload;
                latestBlogs.blogList = latestBlogs.blogList.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false, uppercaseHeadings: false, ignoreHref: true, tags: { 'img': { format: 'skip' } } });
                    // limit length of title
                    blog.title = _.truncate(blog.title, { 'length': 30, 'omission': '...' });
                    // limit length of content
                    blog.content = _.truncate(blog.content, { 'length': 200, 'omission': '...' });

                    return blog
                })

                return {
                    recommendedBLogList, top5CommentedBlogs, top5LikedBlogs, latestBlogs
                }
            } catch (err) {
                console.log(err);
            }
        },
        data() {
            return {
                thresholds: this.$vuetify.breakpoint.thresholds,
                categoriesOptions: categories.reduce((accumulator, currentValue) => {
                    accumulator[currentValue] = this.$t(`pages.blog.categories.${currentValue}`);
                    return accumulator;
                }, {}),
                loadingLatestBlogs: false,
                search: ''
            }
        },
        methods: {
            redirectToAuthorProfile(e) {
                const { authorId } = e.currentTarget.dataset;
                this.$router.push({
                    name: `blog-user-userId___${this.$i18n.locale}`,
                    params: {
                        userId: authorId
                    }
                });
            },
            redirectToLogin() {
                this.$router.push({ name: `auth-login___${this.$i18n.locale}` });
            },
            redirectToRegister() {
                this.$router.push({ name: `auth-register___${this.$i18n.locale}` });
            },
            redirectToBlogCreate() {
                this.$router.push({ name: `blog-create___${this.$i18n.locale}` });
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
            handleInputChange(inputChange) {
                this.search = inputChange;
            },
            async searchBlogs() {
                this.loadingLatestBlogs = true;
                try {
                    let postData = {
                        search: this.search,
                        page: 1,
                        categories: this.categories,
                        userId: this.$route.params.userId
                    }
                    let { blogList, pagination } = await this.$store.dispatch('blog/searchAllBlog', postData);
                    blogList = this.formatBlogList(blogList);
                    this.latestBlogs = {
                        blogList,
                        pagination
                    }
                } catch(err) {
                    // show error message
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar:{
                            open: true,
                            color: 'error',
                            message: this.$t(`messages.common.unknownError`)
                        }
                    });
                }
                this.loadingLatestBlogs = false;
            },
            async loadMoreBlogs() {
                this.loadingLatestBlogs = true;
                try {
                    let postData = {
                        search: this.search,
                        page: this.latestBlogs.pagination.currentPage + 1
                    }
                    let { blogList, pagination } = await this.$store.dispatch('blog/searchAllBlog', postData);
                    blogList = this.formatBlogList(blogList);
                    this.latestBlogs = {
                        blogList: [...this.latestBlogs.blogList, ...blogList],
                        pagination
                    }
                } catch(err) {
                    // show error message
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar:{
                            open: true,
                            color: 'error',
                            message: this.$t(`messages.common.unknownError`)
                        }
                    });
                }
                this.loadingLatestBlogs = false;
            },
            formatBlogList(blogList) {
                let _blogList = blogList.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false, uppercaseHeadings: false });
                    // limit length of title
                    blog.title = _.truncate(blog.title, { 'length': 50, 'omission': '...'  });
                    // limit length of content
                    blog.content = _.truncate(blog.content, { 'length': 200, 'omission': '...'  });

                    return blog
                });
                
                return [..._blogList];
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
        },
        head() {
            return {
                title: this.$t('headers.homePage')
            }
        }
    }
</script>