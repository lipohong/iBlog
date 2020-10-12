<template>
    <div>
        this is blog page
            <div v-if="blog['cover']"><img className="ql-image" :src="blog['cover']" /></div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                blog: {}
            }
        },
        head() {
            return {
                title: this.$t('headers.createBlogPage')
            }
        }
    }
</script>