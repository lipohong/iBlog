<template>
    <article class="blogPreviewContainer">
        <v-progress-linear class="separateBar" value="100" :color="secondaryColor"></v-progress-linear>
        <header @click="redirectToBlogViewingPage">
            <div class="imageContainer">
                <img :src="blog.cover" alt="Blog Cover">
            </div>
            <a>{{ blog.title }}</a>
        </header>
        <section>{{ blog.content }}</section>
        <footer>
            <section>
                <span>{{ categoriesOptions[blog.categories[0]] }}</span>
                <span>{{ $dayjs(blog.updatedDate).format('YYYY-MM-DD HH:mm') }}</span>
            </section>
            <hr>
            <section>
                <div>
                    <v-icon>mdi-eye-outline</v-icon> {{ blog.viewed }}
                    <v-icon>mdi-comment-processing-outline</v-icon> {{ blog.comments }}
                    <v-icon>mdi-heart-outline</v-icon> {{ blog.likes }}
                </div>
                <span>{{ `By ${ author ? author.username : blog.author ? blog.author.username : '' }` }}</span>
            </section>
        </footer>
    </article>
</template>
<script>

export default {
    props: [
        'author', 'blog', 'categoriesOptions'
    ],
    data() {
        return {

        }
    },
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
    computed: {
        primaryColor() {

            return this.$store.state.mode.mode === 'light' ? 'primary' : 'default';
        },
        secondaryColor() {

            return this.$store.state.mode.mode === 'light' ? 'secondary' : 'primary';
        },
    }
}
</script>
