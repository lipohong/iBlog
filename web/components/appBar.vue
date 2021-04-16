<template>
    <v-app-bar :color="primaryColor" flat dark>
        <v-toolbar-title style="cursor: pointer" @click="$router.push({ path: `/${$i18n.locale}` })">iBlog</v-toolbar-title>
        <v-spacer></v-spacer>
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
                    <v-list-item-title style="color: #fff" v-text="`${ $t('pages.layout.theme') } ${index + 1}`"></v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon @click="changeLanguage" v-bind="attrs" v-on="on">
                    <v-icon>mdi-translate</v-icon>
                </v-btn>
            </template>
            {{ $t('messages.layout.languageSwitching') }}
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon @click="changeMode" v-bind="attrs" v-on="on">
                    <v-icon v-if="$store.state.mode.mode === 'light'">mdi-brightness-5</v-icon>
                    <v-icon v-else>mdi-brightness-4</v-icon>
                </v-btn>
            </template>
            {{ $t('pages.layout.lightDarkSwitching') }}
        </v-tooltip>
        <v-menu open-on-hover bottom offset-y v-if="$store.state.user.user._id" >
            <template v-slot:activator="{ on, attrs }">
                <v-avatar v-bind="attrs" v-on="on" size="35" :color="secondaryColor">
                    <img v-if="$store.state.user.user.userInfo.avatar" :src="$store.state.user.user.userInfo.avatar" style="object-fit: cover;">
                    <span v-else>{{ $store.state.user.user.username[0] }}</span>
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
        <v-btn v-else icon @click="redirectToLogin">
            <v-icon>mdi-account-circle</v-icon>
        </v-btn>
    </v-app-bar>
</template>
<script>
    import { light } from '../assets/style/themes/themes';
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
            changeLanguage() {
                this.$i18n.setLocale(this.$i18n.locale === 'en' ? 'zh' : 'en');
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
        },
        computed: {
            primaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'primary' : 'default';
            },
            secondaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'secondary' : 'primary';
            }
        },
    }
</script>