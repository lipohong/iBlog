<template>
    <div class="register">
        <AppBar />
        <v-container class="mt-5" :style="`max-width: ${thresholds.xs}px`">
            <div v-if="verifyCode && verifyEmail">
                <div v-if="verifying">{{ $t(`messages.register.general.activatingAccount`) }}</div>
                <div v-else>{{ $t(`messages.register.errors.activateFail`) }}</div>
            </div>
            <v-sheet v-else color="defualt" elevation="1" rounded>
                <div class="pa-5">
                    <v-form ref="registerForm" v-model="valid" lazy-validation>
                        <div class="registerFormTitle title-1">iBlog {{ $t('headers.registerPage') }}</div>
                        <div class="title-2 mt-8">{{ $t('pages.register.username') }}</div>
                        <v-text-field v-model="username" :rules="usernameRules" outlined dense></v-text-field>
                        <div class="title-2">{{ $t('pages.register.email') }}</div>
                        <v-text-field v-model="email" :rules="emailRules" outlined dense :error-messages="emailRequiredMessage"></v-text-field>
                        <div class="title-2">{{ $t('pages.register.password') }}</div>
                        <v-text-field v-model="password" :rules="passwordRules" outlined dense type="password" />
                        <div class="title-2">{{ $t('pages.register.confirmPassword') }}</div>
                        <v-text-field v-model="confirmPassword" :rules="confirmPasswordRules" outlined dense type="password" />
                        <div class="my-8">
                            <v-btn @click="sumbitLoginForm" :color="primaryColor" block>{{ $t('pages.common.submit') }}</v-btn>
                        </div>
                        <div style="text-align: center">
                            <span @click="redirectToLogin" style="cursor: pointer">{{$t('pages.register.alreadyHaveAccount')}}</span>
                        </div>
                    </v-form>
                </div>
            </v-sheet>
        </v-container>
    </div>
</template>
<script>
    import * as crypto from 'crypto-js';
    import * as _ from 'lodash';
    import AppBar from '../../components/appBar';

    export default {
        data() {
            return {
                thresholds: this.$vuetify.breakpoint.thresholds,
                valid: true,
                verifying: true,
                verifyEmail: this.$route.query.email,
                verifyCode: this.$route.query.verifyCode,
                username: '',
                usernameRules: [
                    v => !!v || this.$t('messages.register.form.usernameRequired')
                ],
                email: '',
                emailRules: [
                    v => !!v || this.$t('messages.forgetPassword.form.emailRequired'),
                    v => /.+@.+\..+/.test(v) || this.$t('messages.forgetPassword.form.emailNotValid'),
                ],
                emailRequiredMessage: null,
                password: '',
                passwordRules: [
                    v => !!v || this.$t('messages.forgetPassword.form.passwordRequired')
                ],
                confirmPassword: ''
            }
        },
        components: { AppBar },
        methods: {
            async encryptAES (password) {
                const encryptedPassword = await crypto.AES.encrypt(password, process.env.aesSecrect).toString();

                return encryptedPassword;
            },
            async sumbitLoginForm() {
                if (!this.$refs.registerForm.validate()) return
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const postData = {
                        username: this.username,
                        email: this.email,
                        password: await this.encryptAES(this.password)
                    }
                    await this.$axios.post(`${process.env.userApi}/users/register`, postData);

                    // send register email success tips
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar: {
                            open: true,
                            color: 'success',
                            message: this.$t(`messages.register.general.registerSuccess`)
                        }
                    });

                    this.redirectToLogin();
                } catch (err) {
                    let errMessage;
                    const message = _.get(err, 'response.data.message');
                    errMessage = !!message ? this.$t(`messages.register.errors.${message}`) : this.$t(`messages.common.unknownError`);

                    // show error message
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar:{
                            open: true,
                            color: 'error',
                            message: errMessage
                        }
                    });
                }
                this.$store.dispatch('global/setProgressBar', { progressBar: false });
            },
            async registerVerify() {
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const postData = {
                        email: this.verifyEmail,
                        verifyCode: this.verifyCode
                    }
                    await this.$axios.post(`${process.env.userApi}/users/registerVerify`, postData);

                    // verify email success tips
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar: {
                            open: true,
                            color: 'success',
                            message: this.$t(`messages.register.general.activateSuccess`)
                        }
                    });

                    this.redirectToLogin();
                } catch (err) {
                    let errMessage;
                    const message = _.get(err, 'response.data.message');
                    errMessage = !!message ? this.$t(`messages.register.errors.${message}`) : this.$t(`messages.common.unknownError`);

                    this.verifying = false;  // control showing verifying fail message

                    // show error message
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar:{
                            open: true,
                            color: 'error',
                            message: errMessage
                        }
                    });
                }
                this.$store.dispatch('global/setProgressBar', { progressBar: false });
            },
            redirectToLogin() {
                this.$router.push({
                    name: `auth-login___${this.$i18n.locale}`
                })
            }
        },
        computed: {
            primaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'primary' : 'default';
            },
            secondaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'secondary' : 'primary';
            },
            confirmPasswordRules() {
                return [
                    !!this.confirmPassword || this.$t('messages.forgetPassword.form.confirmPasswordRequired'),
                    this.confirmPassword === this.password || this.$t('messages.forgetPassword.form.passwordMissmatch')
                ]
            }
        },
        async beforeMount() {
            if (this.verifyEmail && this.verifyCode) {
                await this.registerVerify();
            }
        },
        head() {
            return {
                title: this.$t('headers.registerPage')
            }
        }
    }
</script>