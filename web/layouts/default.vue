<template>
    <v-app>
        <div>
            <v-app-bar :color="primaryColor" flat dark>
                <v-toolbar-title style="cursor: pointer" @click="$router.push({ path: `/${$i18n.locale}` })">iBlog</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu open-on-hover bottom offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon>
                            <v-icon>mdi-translate</v-icon>
                        </v-btn>
                    </template>
                    <v-list :color="secondaryColor">
                        <v-list-item link @click="changeLanguage" data-language="en">
                            <v-list-item-title style="color: #fff">English</v-list-item-title>
                        </v-list-item>
                        <v-divider />
                        <v-list-item link @click="changeLanguage" data-language="zh">
                            <v-list-item-title style="color: #fff">中文繁體</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-menu open-on-hover bottom offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon>
                            <v-icon>mdi-palette</v-icon>
                        </v-btn>
                    </template>
                    <v-list :color="secondaryColor">
                        <v-list-item
                            link
                            v-for="(item, index) in light"
                            :key="index"
                            :style="`background-color: ${item.primary};`"
                            :data-theme="index"
                            @click="changeTheme"
                        >
                            <v-list-item-title style="color: #fff" v-text="`Theme ${index + 1}`"></v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-btn icon @click="changeMode">
                    <v-icon v-if="$store.state.mode.mode === 'light'">mdi-brightness-5</v-icon>
                    <v-icon v-else>mdi-brightness-4</v-icon>
                </v-btn>
                <v-menu open-on-hover bottom offset-y v-if="$store.state.user.user._id" >
                    <template v-slot:activator="{ on, attrs }">
                        <v-avatar v-bind="attrs" v-on="on" size="35" :color="secondaryColor">
                            <img v-if="$store.state.user.user.userInfo.avatar" :src="$store.state.user.user.userInfo.avatar" style="object-fit: cover;">
                            <span v-else>{{ $store.state.user.user.username[0] }}</span>
                        </v-avatar>
                    </template>
                    <v-list :color="secondaryColor">
                        <v-list-item link @click="redirectToUserProfile">
                            <v-list-item-title style="color: #fff">{{ this.$t(`pages.layout.profileManagement`) }}</v-list-item-title>
                        </v-list-item>
                        <v-divider />
                        <v-list-item link @click="redirectToBlogCreate">
                            <v-list-item-title style="color: #fff">{{ this.$t(`pages.layout.postBlog`) }}</v-list-item-title>
                        </v-list-item>
                        <v-divider />
                        <v-list-item link @click="redirectToBlogManagement">
                            <v-list-item-title style="color: #fff">{{ this.$t(`pages.layout.blogsManagement`) }}</v-list-item-title>
                        </v-list-item>
                        <v-divider />
                        <v-list-item link @click="logOut">
                            <v-list-item-title style="color: #fff">{{ this.$t(`pages.layout.logOut`) }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-btn v-else icon @click="redirectToLogin">
                    <v-icon>mdi-account-circle</v-icon>
                </v-btn>
            </v-app-bar>
            <v-progress-linear indeterminate :color="secondaryColor" :active="$store.state.global.progressBar"></v-progress-linear>
        </div>
        <Nuxt />
        <v-snackbar
            :value="$store.state.global.snackBarOpen"
            :color="$store.state.global.snackBarColor"
            timeout="4000"
            @input="closeSnackBar"
        >
            {{ $store.state.global.snackBarMessage }}
        </v-snackbar>
    </v-app>
</template>
<script>
    import { dark, light } from '../assets/style/themes/themes';
    import Cookies from 'js-cookie';

    export default {
        middleware: ['checkTheme', 'checkMode', 'checkAuthentication'],
        data() {
            return {
                light
            }
        },
        methods: {
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
            changeLanguage(e) {
                const language = e.currentTarget.dataset.language;
                this.$i18n.setLocale(language);
            },
            redirectToLogin() {
                this.$router.push({
                    name: `auth-login___${this.$i18n.locale}`,
                    query: {
                        from: this.$route.path
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
            closeSnackBar() {
                this.$store.dispatch('global/setSnackBar', {
                    snackBar:{
                        open: false,
                        color: '',
                        message: ''
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
        },
        created() {
            this.$vuetify.theme.dark = this.$store.state.mode.mode === 'dark';
            this.$vuetify.theme.themes.light = light[this.$store.state.theme.theme];
            this.$vuetify.theme.themes.dark = dark;
        },
        mounted() {
            this.$meta().refresh();
        }
    }
</script>