<template>
    <div class="home top5BlogsContainer">
        <div class="blogContainer" v-for="blog in blogList" :key="blog._id" elevation="1" @click="redirectToBlogViewingPage" :data-blog-id="blog._id">
            <v-container>
                <div style="display: flex">
                    <div>
                        <v-avatar :color="secondaryColor" size="115" tile>
                            <v-img v-if="blog.cover" :src="blog.cover"></v-img>
                            <span class="white--text text-h3" v-else>{{ blog.title[0] }}</span>
                        </v-avatar>
                    </div>
                    <div class="ml-3">
                        <div class="text-h5">
                            <span v-if="blog.cover" v-text="blog.title"/>
                            <span v-else v-text="String(blog.title).slice(1)"/>
                        </div>
                        <div class="mt-1 body-1 text--secondary">
                            <span v-text="String(blog.content).slice(0, 30)"></span>
                        </div>
                        <div class="mt-1 caption text--secondary">
                            <v-icon class="mr-1">mdi-update</v-icon>{{ dayjs(blog.updatedDate).format('YYYY-MM-DD HH:mm') }}
                        </div>
                        <div class="mt-1 body-2">
                            <div v-if="viewed">
                                <v-icon>mdi-eye-outline</v-icon>
                                <span>{{ blog.viewed }}</span>
                            </div>
                            <div v-if="comments">
                                <v-icon>mdi-comment-processing-outline</v-icon>
                                <span>{{ blog.comments }}</span>
                            </div>
                            <div v-if="likes">
                                <v-icon>mdi-heart-outline</v-icon>
                                <span>{{ blog.likes }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </v-container>
        </div>
    </div>
</template>
<script>
    const dayjs = require('dayjs');

    export default {
        props: [
            'blogList', 'viewed', 'comments', 'likes'
        ],
        data() {
            return {
                dayjs,
            }
        },
        methods: {
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
        }
    }
</script>