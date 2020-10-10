<template>
    <div class="forgetPassword mt-5 mb-10">
        <v-container :style="`max-width: ${thresholds.xs}px`">
            <v-sheet color="defualt" elevation="1" rounded>
                <div class="pa-5">
                    <v-form ref="forgetPasswordForm" v-model="valid" lazy-validation>
                        <div class="forgetPasswordFormTitle title-1">iBlog {{ $t('headers.forgetPasswordPage') }}</div>
                        <div class="title-2 mt-8">{{ $t('pages.forgetPassword.email') }}</div>
                        <v-text-field v-model="email" :rules="emailRules" outlined dense :error-messages="emailRequiredMessage"></v-text-field>
                        <div class="title-2">{{ $t('pages.forgetPassword.verifyCode') }}</div>
                        <div class="verifyCodeContainer">
                            <div style="width: 50%">
                                <v-text-field v-model="verifyCode" :rules="verifyCodeRules" outlined dense></v-text-field>
                            </div>
                            <v-btn @click="sendVerifyCodeEmail" :color="secondaryColor">{{ $t('pages.forgetPassword.getVerifyCode') }}</v-btn>
                        </div>
                        <div class="title-2">{{ $t('pages.forgetPassword.password') }}</div>
                        <v-text-field v-model="password" :rules="passwordRules" outlined dense type="password" />
                        <div class="title-2">{{ $t('pages.forgetPassword.confirmPassword') }}</div>
                        <v-text-field v-model="confirmPassword" :rules="confirmPasswordRules" outlined dense type="password" />
                        <div class="my-8">
                            <v-btn @click="sumbitLoginForm" :color="primaryColor" block>{{ $t('pages.common.submit') }}</v-btn>
                        </div>
                        <div style="text-align: center">
                            <span @click="redirectToLogin" style="cursor: pointer">{{$t('pages.forgetPassword.backToLogin')}}</span>
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

    export default {
        data() {
            return {
                thresholds: this.$vuetify.breakpoint.thresholds,
                valid: true,
                email: '',
                emailRules: [
                    v => !!v || this.$t('messages.forgetPassword.form.emailRequired'),
                    v => /.+@.+\..+/.test(v) || this.$t('messages.forgetPassword.form.emailNotValid'),
                ],
                emailRequiredMessage: null,
                verifyCode: '',
                verifyCodeRules: [
                    v => !!v || this.$t('messages.forgetPassword.form.verifyCodeRequired')
                ],
                password: '',
                passwordRules: [
                    v => !!v || this.$t('messages.forgetPassword.form.passwordRequired')
                ],
                confirmPassword: ''
            }
        },
        methods: {
            async encryptAES (password) {
                const encryptedPassword = await crypto.AES.encrypt(password, process.env.aesSecrect).toString();

                return encryptedPassword;
            },
            async sumbitLoginForm() {
                if (!this.$refs.forgetPasswordForm.validate()) return
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const postData = {
                        email: this.email,
                        verifyCode: this.verifyCode,
                        password: await this.encryptAES(this.password)
                    }
                    await this.$axios.post(`${process.env.userApi}/users/resetPassword`, postData);

                    // update password success tips
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar: {
                            open: true,
                            color: 'success',
                            message: this.$t(`messages.forgetPassword.general.resetPasswordSuccess`)
                        }
                    });

                    this.redirectToLogin();
                } catch (err) {
                    let errMessage;
                    const message = _.get(err, 'response.data.message');
                    errMessage = !!message ? this.$t(`messages.forgetPassword.errors.${message}`) : this.$t(`messages.common.unknownError`);

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
            async sendVerifyCodeEmail() {
                if (!this.email) {
                    this.emailRequiredMessage = this.$t('messages.forgetPassword.form.emailRequired');
                    return
                }
                // not an email
                if (!/.+@.+\..+/.test(this.email)) {
                    this.emailRequiredMessage = this.$t('messages.forgetPassword.form.emailNotValid');
                    return
                }
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const postData = {
                        email: this.email
                    }
                    await this.$axios.post(`${process.env.userApi}/users/forgetPassword`, postData);

                    // email sent success tips
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar: {
                            open: true,
                            color: 'success',
                            message: this.$t(`messages.forgetPassword.general.sendVerifyCodeSuccess`)
                        }
                    });
                } catch (err) {
                    let errMessage;
                    const message = _.get(err, 'response.data.message');
                    errMessage = !!message ? this.$t(`messages.forgetPassword.errors.${message}`) : this.$t(`messages.common.unknownError`);

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
        watch: {
            email() {
                this.emailRequiredMessage = null;
            }
        }
    }
</script>