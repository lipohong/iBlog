<template>
    <article class="recommendBlogTileContainer">
        <img :src="blog.cover" alt="Blog Cover" @click="redirectToBlogViewingPage" />
        <main>
            <header @click="redirectToBlogViewingPage">{{ blog.title }}</header>
            <footer>
                <span>{{ blog.author.username }}</span>
                <span>•</span>
                <span>{{ $dayjs(blog.updatedDate).format('YYYY-MM-DD') }}</span>
            </footer>
        </main>
    </article>
</template>
<script>
export default {
    props: ['blog'],
    methods: {
        redirectToBlogViewingPage() {
            this.$router.push({
                name: `blog-blogId___${this.$i18n.locale}`,
                params: {
                    blogId: this.blog._id
                }
            });
        },
    },
}
</script>
