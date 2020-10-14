<template>
    <div class="blog mt-5 mb-10">
        <v-container class="viewBlogContainer" :style="`max-width: ${thresholds.sm}px`">
            this is blog management page
            <div v-for="blog in blogList" :key="blog['_id']">
                <div>
                    <span @click="redirectToBlogViewingPage" :data-blog-id="blog['_id']" style="cursor: pointer">{{ blog['title'] }}</span>
                </div>
            </div>
        </v-container>
    </div>
</template>
<script>
    const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

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
                let blogList = response.data.payload.blogList;
                blogList = blogList.map(blog => {
                    const converter = new QuillDeltaToHtmlConverter(blog.content, {});
                    return {
                        ...blog,
                        content: converter.convert()
                    }
                })
                return {
                    blogList
                }
            } catch (err) {
                redirect(`/${app.i18n.locale}/auth/login`);
            }
        },
        data() {
            return {
                thresholds: this.$vuetify.breakpoint.thresholds
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
            },
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