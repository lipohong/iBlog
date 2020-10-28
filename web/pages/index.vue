<template>
    <div class="home mt-5 mb-15">
        <v-container :style="`max-width: ${thresholds.md}px`">
            <div>
                <span class="text-h6">{{ $t('pages.home.top5BlogsPosters') }}</span>
            </div>
            <div style="display: grid; justify-items: center; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));">
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
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <div v-bind="attrs" v-on="on">
                                                <v-icon class="mr-1">mdi-post</v-icon>
                                                <span class="subheading">{{ author.blogs }}</span>
                                            </div>
                                        </template>
                                        {{ $t('pages.blog.blogsAmount') }}
                                    </v-tooltip>
                                </div>
                            </v-list-item>
                        </v-card-actions>
                    </v-card>
                </div>
            </div>
            <div class="mt-5">
                <span class="text-h6">{{  $t('pages.home.top5ViewedBlogs')}}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
                <v-sheet class="blogContainer ma-2" v-for="blog in top5ViewedBlogs" :key="blog._id" elevation="1" @click="redirectToBlogViewingPage" :data-blog-id="blog._id">
                    <v-container>
                        <div style="display: flex">
                            <div>
                                <v-avatar :color="secondaryColor" size="125" tile>
                                    <v-img v-if="blog.cover" :src="blog.cover"></v-img>
                                    <span class="white--text text-h3" v-else>{{ blog.title[0] }}</span>
                                </v-avatar>
                            </div>
                            <div class="ml-2">
                                <div class="text-h5">{{ blog.title }}</div>
                                <div class="mt-1 body-1 text--secondary">
                                    <span v-text="String(blog.content).slice(0, 30)"></span>
                                </div>
                                <div class="mt-1 caption text--secondary">
                                    {{ $t('pages.blog.lastUpdateAt') }} {{ dayjs(blog.updatedDate).format('YYYY-MM-DD HH:mm') }}
                                </div>
                                <div class="mt-1 body-2">
                                    <v-icon>mdi-eye-outline</v-icon>
                                    <span>{{ blog.viewed || 0 }}</span>
                                </div>
                            </div>
                        </div>
                    </v-container>
                </v-sheet>
            </div>
            <div class="mt-5">
                <span class="text-h6">{{  $t('pages.home.top5CommentedBlogs')}}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
                <v-sheet class="blogContainer ma-2" v-for="blog in top5CommentedBlogs" :key="blog._id" elevation="1" @click="redirectToBlogViewingPage" :data-blog-id="blog._id">
                    <v-container>
                        <div style="display: flex">
                            <div>
                                <v-avatar :color="secondaryColor" size="125" tile>
                                    <v-img v-if="blog.cover" :src="blog.cover"></v-img>
                                    <span class="white--text text-h3" v-else>{{ blog.title[0] }}</span>
                                </v-avatar>
                            </div>
                            <div class="ml-2">
                                <div class="text-h5">{{ blog.title }}</div>
                                <div class="mt-1 body-1 text--secondary">
                                    <span v-text="String(blog.content).slice(0, 30)"></span>
                                </div>
                                <div class="mt-1 caption text--secondary">
                                    {{ $t('pages.blog.lastUpdateAt') }} {{ dayjs(blog.updatedDate).format('YYYY-MM-DD HH:mm') }}
                                </div>
                                <div class="mt-1 body-2">
                                    <v-icon>mdi-comment-processing-outline</v-icon>
                                    <span>{{ blog.comments }}</span>
                                </div>
                            </div>
                        </div>
                    </v-container>
                </v-sheet>
            </div>
            <div class="mt-5">
                <span class="text-h6">{{  $t('pages.home.top5LikedBlogs')}}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
                <v-sheet class="blogContainer ma-2" v-for="blog in top5LikedBlogs" :key="blog._id" elevation="1" @click="redirectToBlogViewingPage" :data-blog-id="blog._id">
                    <v-container>
                        <div style="display: flex">
                            <div>
                                <v-avatar :color="secondaryColor" size="125" tile>
                                    <v-img v-if="blog.cover" :src="blog.cover"></v-img>
                                    <span class="white--text text-h3" v-else>{{ blog.title[0] }}</span>
                                </v-avatar>
                            </div>
                            <div class="ml-2">
                                <div class="text-h5">{{ blog.title }}</div>
                                <div class="mt-1 body-1 text--secondary">
                                    <span v-text="String(blog.content).slice(0, 30)"></span>
                                </div>
                                <div class="mt-1 caption text--secondary">
                                    {{ $t('pages.blog.lastUpdateAt') }} {{ dayjs(blog.updatedDate).format('YYYY-MM-DD HH:mm') }}
                                </div>
                                <div class="mt-1 body-2">
                                    <v-icon>mdi-heart-outline</v-icon>
                                    <span>{{ blog.likes }}</span>
                                </div>
                            </div>
                        </div>
                    </v-container>
                </v-sheet>
            </div>
        </v-container>
    </div>
</template>
<script>
    const dayjs = require('dayjs');
    const htmlToText = require('html-to-text');

    export default {
        async asyncData({ $axios }) {
            try {
                // get top 5 blog posters
                let response = await $axios.get( `${process.env.blogApi}/blogs/blogPosters/top5`);
                const top5BlogPosters = response.data.payload;
                // get top 5 viewed blogs
                response = await $axios.get( `${process.env.blogApi}/blogs/viewedBlogs/top5`);
                let top5ViewedBlogs = response.data.payload;
                top5ViewedBlogs = top5ViewedBlogs.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false });

                    return blog
                })
                // get top 5 commented blogs
                response = await $axios.get(`${process.env.commentApi}/comments/blogs/top5`);
                let top5CommentedBlogs = response.data.payload;
                top5CommentedBlogs = top5CommentedBlogs.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false });

                    return blog
                })
                // get top 5 liked blogs
                response = await $axios.get(`${process.env.commentApi}/likes/blogs/top5`);
                let top5LikedBlogs = response.data.payload;
                top5LikedBlogs = top5LikedBlogs.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false });

                    return blog
                })
                
                return {
                    top5BlogPosters, top5ViewedBlogs, top5CommentedBlogs, top5LikedBlogs
                }
            } catch (err) {
                console.log(err);
            }
        },
        data() {
            return {
                dayjs,
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
            redirectToBlogViewingPage(e) {
                const blogId = e.currentTarget.dataset.blogId;
                this.$router.push({
                    name: `blog-blogId___${this.$i18n.locale}`,
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