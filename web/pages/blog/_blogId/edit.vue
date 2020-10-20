<template>
    <div class="blog mt-5 mb-10">
        <BlogForm :blog="blog" />
    </div>
</template>
<script>
    import BlogForm from '../../../components/blogForm';

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
        components: { BlogForm },
        middleware: ['auth'],
        head() {
            return {
                title: this.$t('headers.editBlogPage')
            }
        }
    }
</script>