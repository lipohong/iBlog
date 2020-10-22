<template>
    <div class="user mt-5 mb-10">
        <v-container :style="`max-width: ${thresholds.xs}px`">
            <v-sheet color="defualt" elevation="1" rounded>
                <div class="pa-5">
                    <v-form ref="profileForm" v-model="valid" lazy-validation>
                        <div class="text-h5 text-center">iBlog {{ $t('headers.profilePage') }}</div>
                        <div class="mt-3 text-center">
                            <v-avatar @click="uploadAvatar" style="cursor: pointer;" size="150" :color="secondaryColor">
                                <img v-if="avatar" :src="avatar" style="object-fit: cover;">
                                <v-btn v-else small>{{ $t('pages.user.uploadAvatar') }} <v-icon>mdi-cloud-upload</v-icon></v-btn>
                            </v-avatar>
                            <v-tooltip v-if="avatar" bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" v-on="on" @click="handleRemoveAvatarButtonClick" icon small>
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </template>
                                {{ $t('pages.user.removeAvatar') }}
                            </v-tooltip>
                        </div>
                        <div class="subtitle-1 mt-2">{{ $t('pages.user.email') }}</div>
                        <v-text-field :value="user.email" readonly outlined hide-details></v-text-field>
                        <div class="subtitle-1 mt-2">{{ $t('pages.user.username') }}</div>
                        <v-text-field v-model="username" :rules="usernameRules" outlined></v-text-field>
                        <div class="subtitle-1 mt-2">{{ $t('pages.user.description') }}</div>
                        <v-textarea v-model="description" outlined solo></v-textarea>
                        <div class="my-8">
                            <v-btn @click="sumbitProfileForm" :color="primaryColor" block>{{ $t('pages.common.submit') }}</v-btn>
                        </div>
                    </v-form>
                </div>
            </v-sheet>
        </v-container>
    </div>
</template>
<script>
    export default {
        async asyncData({ params, $axios, store, redirect, app }) {
            try {
                // get blogs
                let headers = null;
                if (store && store.state.authentication.jwt) {
                    headers = { Authorization: 'Bearer ' + store.state.authentication.jwt };
                } else {
                    // no authority
                    redirect(`/${app.i18n.locale}/auth/login`);
                }
                let response = await $axios.get( `${process.env.userApi}/users`, { headers });
                const user = response.data.payload;

                return {
                    user
                }
            } catch (err) {
                redirect(`/${app.i18n.locale}/auth/login`);
            }
        },
        data() {
            return {
                thresholds: this.$vuetify.breakpoint.thresholds,
                valid: true,
                avatar: '',
                username: '',
                usernameRules: [
                    v => !!v || this.$t('messages.user.form.usernameRequired')
                ],
                description: ''
            }
        },
        methods: {
            async sumbitProfileForm() {
                if (!this.$refs.profileForm.validate()) return
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const postData = {
                        username: this.username,
                        userInfo: {
                            avatar: this.avatar,
                            description: this.description
                        }
                    }
                    await this.$store.dispatch('user/updateUserInfo', { postData })
                    // show update user info success tips
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar:{
                            open: true,
                            color: 'success',
                            message: this.$t(`messages.user.general.updateUserProfileSuccess`)
                        }
                    });
                } catch (err) {
                    // show error message
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar:{
                            open: true,
                            color: 'error',
                            message: this.$t(`messages.common.unknownError`)
                        }
                    });
                }
                this.$store.dispatch('global/setProgressBar', { progressBar: false });
            },
            async uploadAvatar() {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();
                input.onchange = async () => {
                    const newImage = input.files[0];
                    if (newImage) {
                        this.$store.dispatch('global/setProgressBar', { progressBar: true });
                        try {
                            const postData =  new FormData();
                            postData.append("image", newImage);
                            const { data } = await this.$axios.post(
                                `${process.env.fileApi}/files`,
                                postData,
                                {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }
                            );
                            this.avatar = `${process.env.fileApi}/files/${data.payload.fileId}`;
                        } catch (err) {
                            // show error message
                            this.$store.dispatch('global/setSnackBar', {
                                snackBar:{
                                    open: true,
                                    color: 'error',
                                    message: this.$t(`messages.common.unknownError`)
                                }
                            });
                        }
                        this.$store.dispatch('global/setProgressBar', { progressBar: false });
                    }
                }
            },
            handleRemoveAvatarButtonClick() {
                this.avatar = '';
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
        beforeMount() {
            this.username = this.user.username;
            this.description = this.user.userInfo.description;
            this.avatar = this.user.userInfo.avatar;
        },
        middleware: ['auth'],
        head() {
            return {
                title: this.$t('headers.profilePage')
            }
        }
    }
</script>