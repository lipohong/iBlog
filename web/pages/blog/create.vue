<template>
    <div class="blog">
        <AppBar />
        <BlogForm />
    </div>
</template>
<script>
    export default {
        middleware: ['auth'],
        data() {
            return {
                updated: false
            }
        },
        methods: {
            redirectToPreviousPage() {
                this.updated = false;
                this.$store.dispatch('global/setDialog', {
                    dialog: {
                        open: false,
                        title: '',
                        text: '',
                        callbackFunction: () => {}
                    }
                });
                const from = this.$route.query.from;
                if (!!from && from !== '/zh/auth/login' && from !== '/en/auth/login') {
                    this.$router.push({ path: `${from}` });
                } else {
                    this.$router.push({ path: `/${this.$i18n.locale}` });
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            if (this.updated) {
                this.$store.dispatch('global/setDialog', {
                    dialog: {
                        open: true,
                        title: this.$t('messages.common.dialogTitleWarning'),
                        text: this.$t('messages.blog.general.unsaveBlogWarning'),
                        callbackFunction: () => {
                            this.redirectToPreviousPage();
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
                title: this.$t('headers.createBlogPage')
            }
        }
    }
</script>