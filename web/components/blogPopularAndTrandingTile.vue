<template>
    <article class="popularAndTrandingBlogTileContainer">
       <header>
            <img :src="blog.cover" alt="Blog Cover" @click="redirectToBlogViewingPage" />
       </header>
        <main>
            <p>{{ categoriesOptions[blog.categories[0]] }}</p>
            <header @click="redirectToBlogViewingPage"><a>{{ blog.title }}</a></header>
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
    props: ['blog', 'categoriesOptions'],
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
