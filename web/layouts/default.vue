<template>
    <v-app>
        <Nuxt />
    </v-app>
</template>
<script>
    export default {
        middleware: 'checkTheme',
    }
</script>