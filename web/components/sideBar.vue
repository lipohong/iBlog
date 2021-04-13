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
                            <v-icon color="primary">mdi-post</v-icon> <a>{{ $t('pages.sideBar.allBlogs') }}</a>
                        </li>
                        <li :class="selectedItem === 1 ? `selected` : ``">
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
            redirectToAuthorProfile() {
                this.$router.push({
                    name: `blog-user-userId___${this.$i18n.locale}`,
                    params: {
                        userId: this.author._id
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
