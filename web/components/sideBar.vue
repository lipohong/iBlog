<template>
    <div :class="`sideBar${ openMenu ? ' showSideBar' : '' }`">
        <v-sheet class="sideBarContainer" :color="primaryColor">
            <aside>
                <button @click="$router.push({ path: `/${$i18n.locale}` })">
                    <v-icon color="primary">mdi-home</v-icon>
                </button>
                <div class="profileContainer">
                    <v-avatar size="80" :color="secondaryColor">
                        <img v-if="author.userInfo.avatar" :src="author.userInfo.avatar">
                        <span class="white--text" v-else>{{ author.username[0] }}</span>
                    </v-avatar>
                    <h1 class="sideBarAuthorName">{{ author.username }}</h1>
                </div>
                <nav>
                    <ul>
                        <li :class="selectedItem === 0 ? `selected` : ``" @click="redirectToAuthorProfile">
                            <v-icon color="primary">mdi-post</v-icon> <a>All Blogs</a>
                        </li>
                        <li :class="selectedItem === 1 ? `selected` : ``">
                            <v-icon color="primary">mdi-card-account-details</v-icon> <a>About Author</a>
                        </li>
                    </ul>
                </nav>
            </aside>    
        </v-sheet> 
        <v-sheet :class="`sideBarMenuButton${ openMenu ? ' openSideBarMenu' : '' }`" :color="secondaryColor" @click="openMenu = !openMenu">
            <v-icon dark>mdi-menu</v-icon>
        </v-sheet>
    </div>
</template>
<script>
    export default {
        props: ['author', 'selectedItem'],
        data() {
            return {
                openMenu: false
            }
        },
        methods: {
            redirectToAuthorProfile() {
                this.$router.push({
                    name: `blog-user-userId___${this.$i18n.locale}`,
                    params: {
                        userId: this.author._id
                    }
                });
            }
        },
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
