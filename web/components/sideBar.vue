<template>
    <div :class="`sideBar${ openMenu ? ' showSideBar' : '' }`">
        <v-sheet class="sideBarContainer" :color="primaryColor">
            <aside>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <button @click="$router.push({ path: `/${$i18n.locale}` })" v-bind="attrs" v-on="on">
                            <v-icon color="primary">mdi-home</v-icon>
                        </button>
                    </template>
                    {{ $t('pages.sideBar.backToHome') }}
                </v-tooltip>
                <v-menu open-on-hover bottom offset-y v-if="$store.state.user.user._id" >
                    <template v-slot:activator="{ on, attrs }">
                        <v-avatar class="avatarButton" v-bind="attrs" v-on="on" tile>
                            <img v-if="$store.state.user.user.userInfo.avatar" :src="$store.state.user.user.userInfo.avatar" style="object-fit: cover;">
                            <a v-else>{{ $store.state.user.user.username[0] }}</a>
                        </v-avatar>
                    </template>
                    <v-list :color="secondaryColor">
                        <v-list-item link @click="redirectToUserProfile">
                            <v-list-item-title style="color: #fff"><v-icon dark>mdi-card-account-details</v-icon> {{ this.$t(`pages.layout.profileManagement`) }}</v-list-item-title>
                        </v-list-item>
                        <v-divider />
                        <v-list-item link @click="redirectToBlogCreate">
                            <v-list-item-title style="color: #fff"><v-icon dark>mdi-post</v-icon> {{ this.$t(`pages.layout.postBlog`) }}</v-list-item-title>
                        </v-list-item>
                        <v-divider />
                        <v-list-item link @click="redirectToBlogManagement">
                            <v-list-item-title style="color: #fff"><v-icon dark>mdi-playlist-edit</v-icon> {{ this.$t(`pages.layout.blogsManagement`) }}</v-list-item-title>
                        </v-list-item>
                        <v-divider />
                        <v-list-item link @click="logOut">
                            <v-list-item-title style="color: #fff"><v-icon dark>mdi-exit-to-app</v-icon> {{ this.$t(`pages.layout.logOut`) }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-tooltip v-else bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-avatar class="avatarButton" @click="redirectToLogin" tile v-bind="attrs" v-on="on">
                            <v-icon color="primary">mdi-account-circle</v-icon>
                        </v-avatar>
                    </template>
                    {{ $t('pages.sideBar.login') }}
                </v-tooltip>
                <section class="profileContainer">
                    <v-avatar size="80" :color="secondaryColor">
                        <img v-if="author.userInfo.avatar" :src="author.userInfo.avatar">
                        <span class="white--text" v-else>{{ author.username[0] }}</span>
                    </v-avatar>
                    <main>{{ author.username }}</main>
                    <div class="infosContainer">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <div v-bind="attrs" v-on="on">
                                    <v-icon dark>mdi-post</v-icon>
                                    <span>{{ blogsAmount }}</span>
                                </div>
                            </template>
                            {{ $t('pages.blog.blogsAmount') }}
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <div v-bind="attrs" v-on="on">
                                    <v-icon dark>mdi-account-group</v-icon>
                                    <span>{{ followList.length }}</span>
                                </div>
                            </template>
                            {{ $t('pages.blog.fans') }}
                        </v-tooltip>
                    </div>
                </section>
                <nav>
                    <ul>
                        <li :class="selectedItem === 0 ? `selected` : ``" @click="redirectToAuthorBlogListPage">
                            <v-icon color="primary">mdi-post</v-icon> <a>{{ $t('pages.sideBar.allBlogs') }}</a>
                        </li>
                        <li :class="selectedItem === 1 ? `selected` : ``" @click="redirectToAuthorProfile">
                            <v-icon color="primary">mdi-card-account-details</v-icon> <a>{{ $t('pages.sideBar.aboutAuthor') }}</a>
                        </li>
                    </ul>
                    <div class="sideBarButtonGroup">
                        <v-menu open-on-hover bottom offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <button v-bind="attrs" v-on="on">
                                    <v-icon color="primary">mdi-palette</v-icon>
                                </button>
                            </template>
                            <v-list :color="secondaryColor">
                                <v-list-item
                                    link
                                    dark
                                    v-for="(item, index) in light"
                                    :key="index"
                                    :style="`background-color: ${item.primary};`"
                                    :data-theme="index"
                                    @click="changeTheme"
                                >
                                    <v-list-item-title v-text="`${ $t('pages.layout.theme') } ${index + 1}`"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <button @click="changeLanguage" v-bind="attrs" v-on="on">
                                    <v-icon color="primary">mdi-translate</v-icon>
                                </button>
                            </template>
                            {{ $t('pages.sideBar.languageSwitching') }}
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <button @click="changeMode" v-bind="attrs" v-on="on">
                                    <v-icon v-if="$store.state.mode.mode === 'light'" color="primary">mdi-brightness-5</v-icon>
                                    <v-icon v-else color="primary">mdi-brightness-4</v-icon>
                                </button>
                            </template>
                            {{ $t('pages.layout.lightDarkSwitching') }}
                        </v-tooltip>
                    </div>
                </nav>
            </aside>    
        </v-sheet> 
        <v-sheet :class="`sideBarMenuButton${ openMenu ? ' openSideBarMenu' : '' }`" :color="secondaryColor" @click="openMenu = !openMenu">
            <v-icon dark>mdi-menu</v-icon>
        </v-sheet>
    </div>
</template>
<script>
    import { light } from '../assets/style/themes/themes';
    import Cookies from 'js-cookie';

    export default {
        props: ['author', 'blogsAmount', 'selectedItem', 'followList'],
        data() {
            return {
                light,
                openMenu: false
            }
        },
        methods: {
            redirectToLogin() {
                this.$router.push({
                    name: `auth-login___${this.$i18n.locale}`,
                    query: {
                        from: this.$route.path
                    }
                });
            },
            redirectToAuthorBlogListPage() {
                this.$router.push({
                    name: `blog-user-userId___${this.$i18n.locale}`,
                    params: {
                        userId: this.author._id
                    }
                });
            },
            redirectToAuthorProfile() {
                this.$router.push({
                    name: `blog-user-userId-profile___${this.$i18n.locale}`,
                    params: {
                        userId: this.author._id
                    }
                });
            },
            redirectToUserProfile() {
                this.$router.push({ name: `user-profile___${this.$i18n.locale}` });
            },
            redirectToBlogCreate() {
                this.$router.push({
                    name: `blog-create___${this.$i18n.locale}`,
                    query: {
                        from: this.$route.path
                    }
                });
            },
            redirectToBlogManagement() {
                this.$router.push({ name: `blog___${this.$i18n.locale}` });
            },
            logOut() {
                this.$store.dispatch('authentication/resetAuth');   // reset auth info
                this.$store.dispatch('user/resetUser');  // reset user info
                Cookies.remove('authentication');
                this.$router.push({
                    name: `auth-login___${this.$i18n.locale}`,
                    query: {
                        from: this.$route.path
                    }
                });
            },
            changeTheme(e) {
                const theme = e.currentTarget.dataset.theme;
                Cookies.set('theme', theme);
                this.$store.dispatch('theme/setTheme', { theme });
                this.$vuetify.theme.themes.light = light[this.$store.state.theme.theme];
            },
            changeMode() {
                this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
                Cookies.set('mode', this.$vuetify.theme.dark ? 'dark' : 'light');
                this.$store.dispatch('mode/setMode', { mode: this.$vuetify.theme.dark ? 'dark' : 'light' });
            },
            changeLanguage() {
                this.$i18n.setLocale(this.$i18n.locale === 'en' ? 'zh' : 'en');
            },
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
