<template>
    <div class="login mt-5 mb-10">
        <v-container :style="`max-width: ${thresholds.xs}px`">
            <v-sheet color="defualt" elevation="1" rounded class="loginForm">
                <div class="pa-5">
                    <v-form ref="loginForm" v-model="valid" lazy-validation>
                        <div class="loginFormTitle title-1">iBlog {{ $t('headers.loginPage') }}</div>
                        <div class="title-2 mt-8">{{ $t('pages.login.email') }}</div>
                        <v-text-field v-model="email" :rules="emailRules" outlined dense></v-text-field>
                        <div class="title-2">{{ $t('pages.login.password') }}</div>
                        <v-text-field
                            v-model="password"
                            :rules="passwordRules"
                            outlined
                            dense
                            @click:append="passwordShow = !passwordShow"
                            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="passwordShow ? 'text' : 'password'"
                        />
                        <div class="rememberMeForegetPasswordContainer">
                            <v-checkbox v-model="rememberMe" :label="$t('pages.login.rememberMe')" />
                            <span @click="redirectToForgetPassword" style="cursor: pointer">{{$t('pages.login.forgetPassword')}}</span>
                        </div>
                        <div class="my-8">
                            <v-btn @click="sumbitLoginForm" :color="primaryColor" block>{{ $t('pages.login.submit') }}</v-btn>
                        </div>
                        <div style="text-align: center">
                            <span @click="redirectToRegister" style="cursor: pointer">{{$t('pages.login.createAccount')}}</span>
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
    import * as Cookies from 'js-cookie';

    export default {
        data() {
            return {
                thresholds: this.$vuetify.breakpoint.thresholds,
                valid: true,
                email: '',
                emailRules: [
                    v => !!v || this.$t('messages.login.form.emailRequired'),
                    v => /.+@.+\..+/.test(v) || this.$t('messages.login.form.emailNotValid'),
                ],
                password: '',
                passwordShow: false,
                passwordRules: [
                    v => !!v || this.$t('messages.login.form.passwordRequired')
                ],
                rememberMe: false,
            }
        },
        methods: {
            redirectToForgetPassword() {
                this.$router.push({
                    name: `auth-forgetPassword___${this.$i18n.locale}`
                })
            },
            redirectToRegister() {
                this.$router.push({
                    name: `auth-register___${this.$i18n.locale}`
                })
            },
            redirectToPreviousPage() {
                const from = this.$route.query.from;
                if (!!from && from !== '/zh/auth/login' && from !== '/en/auth/login') {
                    this.$router.push({ path: `${from}` });
                } else {
                    this.$router.push({ path: `/${this.$i18n.locale}` });
                }
            },
            async encryptAES (password) {
                const encryptedPassword = await crypto.AES.encrypt(password, process.env.aesSecrect).toString();

                return encryptedPassword;
            },
            async decryptAES (encryptedPassword) {
                const bytes = crypto.AES.decrypt(encryptedPassword, process.env.aesSecrect);
                const decryptPassword = bytes.toString(crypto.enc.Utf8);
                if (!decryptPassword) {
                    throw new Error('ex_incorrect_password');
                }

                return decryptPassword;
            },
            async sumbitLoginForm () {
                if (!this.$refs.loginForm.validate()) return
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const postData = {
                        email: this.email,
                        password: await this.encryptAES(this.password)
                    }
                    await this.$store.dispatch('authentication/logIn', { postData });  // login
                    await this.$store.dispatch('user/getAndSetUserInfo', { userId: this.$store.state.authentication.userId });  // get user info
                    
                    // save logIn data to cookies if rememberMe checked
                    if (this.rememberMe) {
                        Cookies.set('rememberMe', JSON.stringify(postData), { path: '/' });
                    } else {
                        Cookies.remove('rememberMe');
                    }

                    // login success tips
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar: {
                            open: true,
                            color: 'success',
                            message: this.$t(`messages.login.general.loginSuccess`)
                        }
                    });

                    // redirect to previous page
                    this.redirectToPreviousPage();
                } catch (err) {
                    let errMessage;
                    const message = _.get(err, 'response.data.message');
                    errMessage = !!message ? this.$t(`messages.login.errors.${message}`) : this.$t(`messages.common.unknownError`);

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
        async mounted() {
            let postData = Cookies.get('rememberMe');
            if (postData) {
                postData = JSON.parse(postData);
                this.rememberMe = true;
                this.email = postData.email;
                this.password = await this.decryptAES(postData.password);
            }
        }
    }
</script>
