<template>
    <div class="blog">
        <AppBar />
        <BlogForm :blog="blog" />
    </div>
</template>
<script>

    export default {
        async asyncData({ params, $axios, store, redirect, app }) {
            try {
                // get blog
                if (!store || !store.state.authentication.jwt) {
                    redirect(`/${app.i18n.locale}/auth/login`);
                }
                const headers = { Authorization: 'Bearer ' + store.state.authentication.jwt };
                let response = await $axios.get( `${process.env.blogApi}/blogs/${params.blogId}`, { headers });
                const blog = response.data.payload;

                return {
                    blog
                }
            } catch (err) {
                redirect(`/${app.i18n.locale}/auth/login`);
            }
        },
        middleware: ['auth'],
        data() {
            return {
                updated: false
            }
        },
        methods: {
            redirectToBlogManagement() {
                this.updated = false;
                this.$store.dispatch('global/setDialog', {
                    dialog: {
                        open: false,
                        title: '',
                        text: '',
                        callbackFunction: () => {}
                    }
                });
                this.$router.push({ name: `blog___${this.$i18n.locale}` });
            },
        },
        beforeRouteLeave(to, from, next) {
            if (this.updated) {
                this.$store.dispatch('global/setDialog', {
                    dialog: {
                        open: true,
                        title: this.$t('messages.common.dialogTitleWarning'),
                        text: this.$t('messages.blog.general.unsaveBlogWarning'),
                        callbackFunction: () => {
                            this.redirectToBlogManagement();
                        }
                    }
                });
                next(false);
            } else {
                next(true);
            }
        },
        head() {
            return {
                title: this.$t('headers.editBlogPage')
            }
        }
    }
</script>