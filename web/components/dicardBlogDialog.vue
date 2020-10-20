<template>
    <v-dialog :value="open" persistent max-width="400">
        <v-card>
            <v-card-title>{{ this.$t('messages.common.dialogTitleWarning') }}</v-card-title>
            <v-card-text>{{ this.$t('messages.blog.general.discardBlogWarning') }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="default" outlined @click="handleDialogClose">{{ $t('pages.common.cancel') }}</v-btn>
                <v-btn color="error" @click="discardBlog">{{ $t('pages.common.confirm') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        props: ['open'],
        methods: {
            handleDialogClose() {
                this.$parent.$parent.dialogOpen = false;
            },
            async discardBlog() {
                if (this.$route.params.blogId) {
                    try {
                        await this.$axios.delete(`${process.env.blogApi}/blogs/${this.$route.params.blogId}`);
                        // show delete blog success tips
                        this.$store.dispatch('global/setSnackBar', {
                            snackBar:{
                                open: true,
                                color: 'success',
                                message: this.$t(`messages.blog.general.discardBlogSuccess`)
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
                }
                this.redirectToBlogManagement();
            },
            redirectToBlogManagement() {
                this.$router.push({ name: `blog___${this.$i18n.locale}` })
            }
        }
    }
</script>