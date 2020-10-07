<template>
    <div class="home">
        <v-btn color="error" @click="jump">Hello World {{ $t(`welcome`) }}</v-btn>
        <v-btn color="warning">Change</v-btn>
    </div>
</template>
<script>
    export default {
        methods: {
            jump() {
                this.$router.push({
                    name: `user-profile___${this.$i18n.locale}`
                })
            }
        }
    }
</script>