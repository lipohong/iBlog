<template>
    <div class="blog mt-5 mb-10">
        <v-container class="viewBlogContainer" :style="`max-width: ${thresholds.sm}px`">
            <div class="coverContainer mb-5" v-if="blog['cover']">
                <img class="cover" :src="blog['cover']" />
            </div>
            <div class="blogTitle" v-text="blog['title']"></div>
            <div style="display: flex; align-items: center">
                <v-menu open-on-hover bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-avatar size="40" v-bind="attrs" v-on="on" :color="secondaryColor">
                            <img v-if="author.avatar" :src="author.avatar" style="object-fit: cover;">
                            <span class="white--text" v-else>{{ author.username[0] }}</span>
                        </v-avatar>
                    </template>
                    <v-list :color="secondaryColor">
                        <v-list-item link @click="followAndUnfollow">
                            <v-list-item-title style="color: #fff">{{ this.$t(`pages.blog.follow`) }}</v-list-item-title>
                        </v-list-item>
                        <v-divider />
                        <v-list-item link @click="redirectToAuthorProfile">
                            <v-list-item-title style="color: #fff">{{ this.$t(`pages.blog.viewProfile`) }}</v-list-item-title>
                        </v-list-item>
                        <v-divider />
                    </v-list>
                </v-menu>
                <div class="ma-2" >
                    <div style="cursor: pointer; wordBreak: break-word">{{ author.username }}</div>
                    <div class="updatedDate">{{ dayjs(blog['updatedDate']).format('YYYY-MM-DD HH:mm:ss') }}</div>
                </div>
            </div>
            <div class="mt-5" v-html="blog['content']"></div>
        </v-container>
    </div>
</template>
<script>
    const dayjs = require('dayjs');
    const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

    export default {
        async asyncData({ params, $axios, store, redirect, app }) {
            try {
                // get blog
                let headers = null;
                if (store && store.state.authentication.jwt) {
                    headers = { Authorization: 'Bearer ' + store.state.authentication.jwt };
                }
                let response = await $axios.get( `${process.env.blogApi}/blogs/${params.blogId}`, { headers });
                let blog = response.data.payload;
                const converter = new QuillDeltaToHtmlConverter(blog.content, {});
                blog.content = converter.convert();
                // get author info
                response = await $axios.get(`${process.env.userApi}/users/${blog['userId']}`);
                const author = response.data.payload;
                return {
                    blog, author
                }
            } catch (err) {
                redirect(`/${app.i18n.locale}/auth/login`);
            }
        },
        data() {
            return {
                thresholds: this.$vuetify.breakpoint.thresholds,
                dayjs,
            }
        },
        methods: {
            followAndUnfollow() {

            },
            redirectToAuthorProfile() {

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
                title: this.blog.title || 'Error'
            }
        }
    }
</script>