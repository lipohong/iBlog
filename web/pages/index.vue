<template>
    <div class="home">
        <div class="bannerContainer">
            <div class="py-15 px-3">
                <div class="text-sm-h4 text-h5 text-center">{{ $t('pages.home.shareWithIBlog') }}</div>
                <div class="mt-5 text-body-1 text-center">{{ $t('pages.home.description') }}</div>
                <div class="mt-1 text-body-1 text-center font-weight-bold" v-if="!$store.state.user.user._id">
                    <span style="cursor: pointer" @click="redirectToLogin">
                        {{ $t('pages.home.login') }}
                    </span> | 
                    <span style="cursor: pointer" @click="redirectToBlogCreate">
                        {{ $t('pages.home.postBlog') }}
                    </span> | 
                    <span style="cursor: pointer" @click="redirectToRegister">
                        {{ $t('pages.home.register') }}
                    </span>
                </div>
            </div>
        </div>
        <v-container :style="`max-width: ${thresholds.md}px`">
            <v-tabs show-arrows right v-model="tab">
                <v-tab small v-for="(item, index) in tabTitles" :key= index>{{ item }}</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item
                    v-for="(item, index) in [top5ViewedBlogs, top5CommentedBlogs, top5LikedBlogs]"
                    :key="index"
                >
                    <BlogTile :blogList="item" :viewed="index === 0" :comments="index === 1" :likes="index === 2" />
                </v-tab-item>
            </v-tabs-items>
            <div class="mt-5 text-h6">
                <span>{{ $t('pages.home.top5LatestBlogs') }}</span>
            </div>
            <div v-if="latestBlogs">
                <v-sheet class="blogContainer mb-2" v-for="(blog, index) in latestBlogs.blogList" :key="index" elevation="1" @click="redirectToBlogViewingPage" :data-blog-id="blog._id">
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
                <div class="mt-10 text-center" v-if="latestBlogs.pagination.currentPage < latestBlogs.pagination.totalPage">
                    <v-progress-circular v-if="loadingLatestBlogs" indeterminate :color="primaryColor"></v-progress-circular>
                </div>
            </div>
        </v-container>
    </div>
</template>
<script>
    import * as _ from 'lodash';
    const dayjs = require('dayjs');
    import BlogTile from '../components/blogTile';
    const htmlToText = require('html-to-text');

    export default {
        async asyncData({ $axios }) {
            try {
                // get top 5 viewed blogs
                let response = await $axios.get( `${process.env.blogApi}/blogs/viewedBlogs/top5`);
                let top5ViewedBlogs = response.data.payload;
                top5ViewedBlogs = top5ViewedBlogs.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false, uppercaseHeadings: false });
                    // limit length of title
                    blog.title = _.truncate(blog.title, { 'length': 50 });
                    // limit length of content
                    blog.content = _.truncate(blog.content, { 'length': 30 });

                    return blog
                })
                // get top 5 commented blogs
                response = await $axios.get(`${process.env.commentApi}/comments/blogs/top5`);
                let top5CommentedBlogs = response.data.payload;
                top5CommentedBlogs = top5CommentedBlogs.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false, uppercaseHeadings: false });
                    // limit length of title
                    blog.title = _.truncate(blog.title, { 'length': 50 });
                    // limit length of content
                    blog.content = _.truncate(blog.content, { 'length': 30 });

                    return blog
                })
                // get top 5 liked blogs
                response = await $axios.get(`${process.env.commentApi}/likes/blogs/top5`);
                let top5LikedBlogs = response.data.payload;
                top5LikedBlogs = top5LikedBlogs.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false, uppercaseHeadings: false });
                    // limit length of title
                    blog.title = _.truncate(blog.title, { 'length': 50 });
                    // limit length of content
                    blog.content = _.truncate(blog.content, { 'length': 30 });

                    return blog
                })
                // get latest 10 blogs
                response = await $axios.get(`${process.env.blogApi}/blogs?page=1&perPage=5`);
                let latestBlogs = response.data.payload;
                latestBlogs.blogList = latestBlogs.blogList.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false, uppercaseHeadings: false });
                    // limit length of title
                    blog.title = _.truncate(blog.title, { 'length': 50 });
                    // limit length of content
                    blog.content = _.truncate(blog.content, { 'length': 30 });

                    return blog
                })

                return {
                    top5ViewedBlogs, top5CommentedBlogs, top5LikedBlogs, latestBlogs
                }
            } catch (err) {
                console.log(err);
            }
        },
        components: {
            BlogTile
        },
        data() {
            return {
                dayjs,
                thresholds: this.$vuetify.breakpoint.thresholds,
                tab: 0,
                tabTitles: [
                    this.$t('pages.home.top5ViewedBlogs'),
                    this.$t('pages.home.top5CommentedBlogs'),
                    this.$t('pages.home.top5LikedBlogs')
                ],
                loadingLatestBlogs: false,
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
            async loadMoreBlogs() {
                this.loadingLatestBlogs = true;
                try {
                    let response = await this.$axios.get(`${process.env.blogApi}/blogs?page=${this.latestBlogs.pagination.currentPage + 1}&perPage=5`);
                    let latestBlogs = response.data.payload;
                    latestBlogs.blogList = latestBlogs.blogList.map(blog => {
                        // conver html to plain string
                        blog.content = htmlToText.fromString(blog.content, { wordwrap: false, uppercaseHeadings: false });
                        // limit length of title
                        blog.title = _.truncate(blog.title, { 'length': 50 });
                        // limit length of content
                        blog.content = _.truncate(blog.content, { 'length': 30 });

                        return blog
                    });
                    this.latestBlogs = {
                        blogList: [...this.latestBlogs.blogList, ...latestBlogs.blogList],
                        pagination: latestBlogs.pagination
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
        mounted() {
            if (process.client) {
                window.onscroll = () => {
                    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                        // you're at the bottom of the page
                        this.loadMoreBlogs();
                    }
                };
            }
        },
        head() {
            return {
                title: this.$t('headers.homePage')
            }
        }
    }
</script>