<template>
    <v-app class="layout">
        <v-progress-linear indeterminate :color="secondaryColor" :active="$store.state.global.progressBar"></v-progress-linear>
        <div class="nuxt">
            <Nuxt />
        </div>
        <v-snackbar
            :value="$store.state.global.snackBarOpen"
            :color="$store.state.global.snackBarColor"
            timeout="4000"
            @input="closeSnackBar"
        >
            {{ $store.state.global.snackBarMessage }}
        </v-snackbar>
        <v-dialog :value="$store.state.global.dialogOpen" persistent max-width="400">
            <v-card>
                <v-card-title>{{ $store.state.global.dialogTitle }}</v-card-title>
                <v-card-text>{{ $store.state.global.dialogText }}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="default" outlined @click="closeDialog">{{ $t('pages.common.cancel') }}</v-btn>
                    <v-btn color="error" @click="$store.state.global.dialogCallbackFunction">{{ $t('pages.common.confirm') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>
<script>
    import { dark, light } from '../assets/style/themes/themes';

    export default {
        middleware: ['checkTheme', 'checkMode', 'checkAuthentication'],
        methods: {
            closeSnackBar() {
                this.$store.dispatch('global/setSnackBar', {
                    snackBar: {
                        open: false,
                        color: '',
                        message: ''
                    }
                });
            },
            closeDialog() {
                this.$store.dispatch('global/setDialog', {
                    dialog: {
                        open: false,
                        title: '',
                        text: '',
                        callbackFunction: () => {}
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