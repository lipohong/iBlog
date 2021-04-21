<template>
    <div class="searchBarContainer">
        <v-sheet class="searchButton" color="primary" @click="searchFunction">
            <v-icon dark>mdi-magnify</v-icon>
        </v-sheet>
        <input  @input="updateSearch($event.target.value)" :placeholder="$t('pages.blog.search')">
    </div>
</template>
<script>
    export default {
        props: ['searchFunction'],
        methods: {
            updateSearch(search) {
                this.$emit('input', search);
            }
        }
    }
</script>