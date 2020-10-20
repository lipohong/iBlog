<template>
    <div class="blog mt-5 mb-10">
        <BlogForm />
    </div>
</template>
<script>
    import BlogForm from '../../components/blogForm';

    export default {
        components: { BlogForm },
        middleware: ['auth'],
        head() {
            return {
                title: this.$t('headers.createBlogPage')
            }
        }
    }
</script>