<template>
    <div class="home">
        <v-btn color="error" @click="jump">Hello World</v-btn>
        <v-btn color="warning" @click="test">Change</v-btn>
    </div>
</template>
<script>
    export default {
        methods: {
            jump() {
                this.$router.push({
                    name: `user-profile___${this.$i18n.locale}`
                })
            },
            test() {
                this.$store.dispatch('global/setProgressBar', { progressBar: !this.$store.state.global.progressBar })
                this.$axios.post(`${process.env.blogApi}/blogs`)
            }
        },
        head() {
            return {
                title: this.$t('headers.homePage')
            }
        },
    }
</script>