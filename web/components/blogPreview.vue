<template>
    <div class="blog">
        <div class="blogPreviewContainer">
            <v-progress-linear class="sperateBar" value="100" :color="primaryColor"></v-progress-linear>
            <img :src="blog.cover" alt="Blog Cover">
            <h2>{{ blog.title }}</h2>
            <p>{{ blog.content }}</p>
            <span>{{ $dayjs(blog.updatedDate).format('YYYY-MM-DD HH:mm') }}</span>
        </div>
    </div>
</template>
<script>

export default {
    props: [
        'blog', 'viewed', 'comments', 'likes'
    ],
    data() {
        return {

        }
    },
    computed: {
        primaryColor() {

            return this.$store.state.mode.mode === 'light' ? 'primary' : 'default';
        }
    }
}
</script>
