<template>
    <div class="home">
        <div class="bannerContainer">
            <div class="py-15 px-3">
                <div class="text-sm-h4 text-h5 text-center">{{ $t('pages.home.shareWithIBlog') }}</div>
                <div class="mt-5 text-body-1 text-center">{{ $t('pages.home.description') }}</div>
                <div class="mt-1 text-body-1 text-center font-weight-bold">
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
            <div>
                <span class="text-h6">{{ $t('pages.home.top5BlogsPosters') }}</span>
            </div>
            <div class="top5BlogPostersContainer">
                <div class="ma-2" v-for="author in top5BlogPosters" :key="author._id" style="cursor: pointer" :data-author-id="author._id" @click="redirectToAuthorProfile" >
                    <v-card :color="secondaryColor" dark width="130">
                        <v-card-title>
                            <v-avatar size="40" :color="specialColor">
                                <img v-if="author.userInfo.avatar" :src="author.userInfo.avatar" style="object-fit: cover">
                                <span class="white--text" v-else>{{ author.username[0] }}</span>
                            </v-avatar>
                        </v-card-title>

                        <v-card-text class="font-weight-bold">
                            <div style="wordBreak: break-word">{{ author.username }}</div>
                        </v-card-text>

                        <v-card-actions>
                            <v-list-item>
                                <div style="width: 100%; display: flex; justify-content: flex-end; align-items: center">
                                    <div>
                                        <v-icon class="mr-1">mdi-post</v-icon>
                                        <span class="subheading">{{ author.blogs }}</span>
                                    </div>
                                </div>
                            </v-list-item>
                        </v-card-actions>
                    </v-card>
                </div>
            </div>
            <div class="mt-5 text-h6">
                <span>{{  $t('pages.home.top5LatestBlogs')}}</span>
            </div>
            <BlogTile :blogList="top5LatestBlogs" />
            <div class="mt-5 text-h6">
                <span>{{  $t('pages.home.top5ViewedBlogs')}}</span>
            </div>
            <BlogTile :blogList="top5ViewedBlogs" :viewed="true" />
            <div class="mt-5 text-h6">
                <span>{{  $t('pages.home.top5CommentedBlogs')}}</span>
            </div>
            <BlogTile :blogList="top5CommentedBlogs" :comments="true" />
            <div class="mt-5 text-h6">
                <span>{{  $t('pages.home.top5LikedBlogs')}}</span>
            </div>
            <BlogTile :blogList="top5LikedBlogs" :likes="true" />
        </v-container>
    </div>
</template>
<script>
    import * as _ from 'lodash';
    import BlogTile from '../components/blogTile';
    const htmlToText = require('html-to-text');

    export default {
        async asyncData({ $axios }) {
            try {
                // get top 5 blog posters
                let response = await $axios.get( `${process.env.blogApi}/blogs/blogPosters/top5`);
                const top5BlogPosters = response.data.payload;
                // get top 5 latest blogs
                response = await $axios.get( `${process.env.blogApi}/blogs/latestBlogs/top5`);
                let top5LatestBlogs = response.data.payload;
                top5LatestBlogs = top5LatestBlogs.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false, uppercaseHeadings: false });
                    // limit length of title
                    blog.title = _.truncate(blog.title, { 'length': 50 });
                    // limit length of content
                    blog.content = _.truncate(blog.content, { 'length': 30 });

                    return blog
                })
                // get top 5 viewed blogs
                response = await $axios.get( `${process.env.blogApi}/blogs/viewedBlogs/top5`);
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
                
                return {
                    top5BlogPosters, top5LatestBlogs, top5ViewedBlogs, top5CommentedBlogs, top5LikedBlogs
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
                thresholds: this.$vuetify.breakpoint.thresholds,
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
        },
    }
</script>