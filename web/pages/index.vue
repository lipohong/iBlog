<template>
    <div class="home">
        <v-btn color="primary" @click="jump">Hello World {{ $t(`welcome`) }}</v-btn>
    </div>
</template>
<script>
    import themes from '../assets/style/themes/themes';

    export default {
        methods: {
            jump() {
                this.$router.push({
                    name: `user-profile___${this.$i18n.locale}`
                })
            }
        },
        mounted() {
            this.$vuetify.theme.themes = themes[2]
            console.log(themes[2]);
            console.log(this.$vuetify.theme.themes);
        }
    }
</script>