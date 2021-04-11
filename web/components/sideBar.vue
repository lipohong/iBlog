<template>
    <v-sheet class="sideBar" :color="primaryColor">
        <div class="sideBarContainer">
            <v-avatar class="sideBarAvatar" size="100" :color="secondaryColor">
                <img v-if="author.userInfo.avatar" :src="author.userInfo.avatar">
                <span class="white--text" v-else>{{ author.username[0] }}</span>
            </v-avatar>
            <h1 class="sideBarAuthorName">{{ author.username }}</h1>
            <h2>All BLogs</h2>
            <h2>About Author</h2>
        </div>    
    </v-sheet> 
</template>
<script>
    export default {
        props: ['author'],
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
