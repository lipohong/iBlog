<template>
    <v-sheet class="sideBar" :color="primaryColor"></v-sheet> 
</template>
<script>
    export default {
        computed: {
            primaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'primary' : 'default';
            },
            secondaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'secondary' : 'primary';
            }
        }
    }
</script>
