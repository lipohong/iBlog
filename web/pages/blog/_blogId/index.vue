<template>
    <div class="blog ql-snow mt-5 mb-10">
        <v-container class="viewBlogContainer ql-editor" :style="`max-width: ${thresholds.sm}px`">
            <div class="coverContainer mb-5" v-if="blog['cover']">
                <img class="cover" :src="blog['cover']" />
            </div>
            <div class="blogTitle" v-text="blog['title']"></div>
            <div class="updatedDate" style="display: flex; flex-wrap: wrap; align-items: center">
                <AuthorProfile :author="author" />
                <v-icon>mdi-update</v-icon>
                <span>{{ dayjs(blog['updatedDate']).format('YYYY/MM/DD HH:mm') }}</span>
                <v-icon class="ml-4">mdi-eye-outline</v-icon>
                <span>{{ blog.viewed || 0 }}</span>
                <v-icon class="ml-4">mdi-comment-processing-outline</v-icon>
                <span>{{ comments }}</span>
                <v-icon class="ml-4">mdi-heart-outline</v-icon>
                <span>{{ likes }}</span>
            </div>
            <FunctionButton :blog="blog" :collected="collected" :liked="liked" :handleCollectButtonClick="handleCollectButtonClick" :handLikeButtonClick="handLikeButtonClick"  />
            <div v-html="blog['content']"></div>
            <FunctionButton :blog="blog" :collected="collected" :liked="liked" :handleCollectButtonClick="handleCollectButtonClick" :handLikeButtonClick="handLikeButtonClick"  />
            <div class="mt-1 body-2">
                <v-icon>mdi-eye-outline</v-icon>
                <span>{{ blog.viewed || 0 }}</span>
                <v-icon class="ml-2">mdi-comment-processing-outline</v-icon>
                <span>{{ comments }}</span>
                <v-icon class="ml-2">mdi-heart-outline</v-icon>
                <span>{{ likes }}</span>
            </div>
            <div class="mt-2">

            </div>
            <v-overlay :value="collectionOverlay">
                <v-sheet rounded :light="!$vuetify.theme.dark">
                    <v-container>
                        <div style="text-align: right">
                            <v-btn icon small @click="collectionOverlay = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </div>
                        <div class="text-h6 text-center font-weight-bold">
                            <span>{{ $t('pages.blog.collectBlog') }}</span>
                        </div>
                        <div>
                            <span class="text-subtitle-2">{{ $t('pages.blog.addCollection') }}</span>
                        </div>
                        <div style="display: flex">
                            <v-text-field
                                v-model="collectionName"
                                outlined
                                dense
                                :placeholder="$t('pages.blog.collectionName')"
                                :error-messages="collectionNameRequiredMessage"
                                append-icon="mdi-folder-plus-outline"
                                @click:append="handleAddCollectButtonClick"
                            />
                        </div>
                        <div class="pb-4" v-if="collectionList">
                            <span class="text-subtitle-2">{{ $t('pages.blog.collectionList') }}</span>
                            <div class="mt-2">
                                <div class="text-center" v-if="collectionList.length === 0">
                                    {{ $t('pages.blog.noCollection') }}
                                </div>
                                <v-data-table
                                    :headers="headers"
                                    :items="collectionList"
                                    item-key="_id"
                                    show-select
                                    disable-sort
                                    style="max-width: 350px; min-width: 250px"
                                    :items-per-page="100"
                                    hide-default-footer
                                    @item-selected="handleSellectOneCollection"
                                    @toggle-select-all="handleSellectAllCollection"
                                    :value="selected"
                                />
                            </div>
                        </div>
                    </v-container>
                </v-sheet>
            </v-overlay>
        </v-container>
    </div>
</template>
<script>
    import AuthorProfile from '../../../components/authorProfile';
    import FunctionButton from '../../../components/functionButton';
    const dayjs = require('dayjs');

    export default {
        components: {
            AuthorProfile, FunctionButton
        },
        async asyncData({ params, $axios, store, redirect, app }) {
            try {
                // get blog
                let headers = null;
                if (store && store.state.authentication.jwt) {
                    headers = { Authorization: 'Bearer ' + store.state.authentication.jwt };
                }
                let response = await $axios.get( `${process.env.blogApi}/blogs/${params.blogId}`, { headers });
                let blog = response.data.payload;
                // get author info
                response = await $axios.get(`${process.env.userApi}/users/${blog['userId']}`);
                const author = response.data.payload;
                // get collectionList
                let collectionList = [];
                if (headers) {
                    response = await $axios.get(`${process.env.commentApi}/collections`, { headers });
                    collectionList = response.data.payload;
                }
                // get comments amount
                response = await $axios.get(`${process.env.commentApi}/comments/blog/${params.blogId}/amount`);
                const comments = response.data.payload;
                // get likes amount
                response = await $axios.get(`${process.env.commentApi}/likes/blog/${params.blogId}/amount`);
                const likes = response.data.payload;
                return {
                    blog, author, collectionList, comments, likes
                }
            } catch (err) {
                redirect(`/${app.i18n.locale}/auth/login`);
            }
        },
        data() {
            return {
                thresholds: this.$vuetify.breakpoint.thresholds,
                dayjs,
                collectionOverlay: false,
                liked: false,
                collectionName: '',
                collectionNameRequiredMessage: null,
                selected: [],
                headers: [
                    {
                        text: this.$t('pages.blog.oldCollectionName'),
                        value: 'name',
                        width: '100px',
                        align: 'left'
                    }
                ]
            }
        },
        methods: {
            async handleCollectButtonClick() {
                if (!this.$store.state.authentication.jwt) {
                    this.redirectToLogin();
                    return
                }
                await this.getCollections();
                this.collectionOverlay = true;
            },
            async getCollections() {
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const { data } = await this.$axios.get(`${process.env.commentApi}/collections`);
                    this.collectionList = data.payload;
                    this.selected = [];
                    for (let collection of this.collectionList) {
                        if (collection['blogIds'].indexOf(this.$route.params.blogId) !== -1) {
                            this.selected.push(collection);
                        }
                    }
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
            async handleAddCollectButtonClick() {
                if (!this.collectionName) {
                    this.collectionNameRequiredMessage = this.$t('messages.blog.form.collectionNameRequired');
                    return
                }
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const postData = { name: this.collectionName }
                    await this.$axios.post(`${process.env.commentApi}/collections`, postData);
                    this.collectionName = '';
                    await this.getCollections();
                } catch(err) {
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
            async handleSellectOneCollection(e) {
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const { item, value } = e;
                    if (value) {
                        // collect
                        await this.$axios.post(`${process.env.commentApi}/collections/${item['_id']}/blog/${this.$route.params.blogId}`, null);
                    } else {
                        // discollect
                        await this.$axios.delete(`${process.env.commentApi}/collections/${item['_id']}/blog/${this.$route.params.blogId}`);
                    }
                    await this.getCollections();
                } catch(err) {
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
            async handleSellectAllCollection(e) {
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const { items, value } = e;
                    if (value) {
                        // collect
                        const promise = items.map((item) => {

                            return new Promise(async (resolve, reject) => {
                                try {
                                    await this.$axios.post(`${process.env.commentApi}/collections/${item['_id']}/blog/${this.$route.params.blogId}`, null);
                                    resolve(true);
                                } catch (err) {
                                    reject(err);
                                }
                            })
                        });
                        await Promise.all(promise);
                    } else {
                        // discollect
                        const promise = items.map((item) => {

                            return new Promise(async (resolve, reject) => {
                                try {
                                    await this.$axios.delete(`${process.env.commentApi}/collections/${item['_id']}/blog/${this.$route.params.blogId}`);
                                    resolve(true);
                                } catch (err) {
                                    reject(err);
                                }
                            })
                        });
                        
                        await Promise.all(promise);
                    }
                    await this.getCollections();
                } catch(err) {
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
            async handLikeButtonClick() {
                if (!this.$store.state.authentication.jwt) {
                    this.redirectToLogin();
                    return
                }
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    await this.$axios.post(`${process.env.commentApi}/likes/blog/${this.$route.params.blogId}`);
                    this.liked = !this.liked;
                    await this.getLikesAmount();
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
            async getCommentsAmount() {
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const response = await this.$axios.get(`${process.env.commentApi}/comments/blog/${this.$route.params.blogId}/amount`);
                    this.comments = response.data.payload;
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
            async getLikesAmount() {
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const response = await this.$axios.get(`${process.env.commentApi}/likes/blog/${this.$route.params.blogId}/amount`);
                    this.likes = response.data.payload;
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
            redirectToLogin() {
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
            },
            collected() {
                for (let collection of this.collectionList) {
                    if (collection['blogIds'].indexOf(this.$route.params.blogId) !== -1) {
                        return true;
                    }
                }
                return false;
            }
        },
        head() {
            return {
                title: `${this.$t('headers.viewBlogPage')} - ${this.blog.title}` || 'Error'
            }
        },
        beforeMount() {
            this.liked = this.blog['liked'];
        },
        watch: {
            collectionName() {
                this.collectionNameRequiredMessage = null;
            }
        }
    }
</script>