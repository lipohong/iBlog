<template>
    <div class="blog">
        <SideBar :author="author" :followList="followList" :blogsAmount="blogsAmount" />
        <div class="viewBlogContainer" >
            <main :style="`max-width: ${thresholds.sm}px`">
                <v-progress-linear class="sperateBar" value="100" :color="primaryColor"></v-progress-linear>
                <div class="coverContainer mb-5" v-if="blog['cover']">
                    <img class="cover" :src="blog['cover']" />
                </div>
                <div class="blogTitle" v-text="blog['title']"></div>
                <div class="updatedDate" style="display: flex; flex-wrap: wrap; align-items: center">
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
                <div class="ql-snow">
                    <div class="ql-editor" v-html="blog['content']"></div>
                </div>
                <FunctionButton :blog="blog" :collected="collected" :liked="liked" :handleCollectButtonClick="handleCollectButtonClick" :handLikeButtonClick="handLikeButtonClick"  />
                <div class="mt-1 body-2">
                    <v-icon>mdi-eye-outline</v-icon>
                    <span>{{ blog.viewed || 0 }}</span>
                    <v-icon class="ml-2">mdi-comment-processing-outline</v-icon>
                    <span>{{ comments }}</span>
                    <v-icon class="ml-2">mdi-heart-outline</v-icon>
                    <span>{{ likes }}</span>
                </div>
                <v-progress-linear class="sperateBar" value="100" :color="primaryColor"></v-progress-linear>
                <div class="mt-10">
                    <div v-if="commentList.length > 0">
                        <v-timeline align-top dense>
                            <v-timeline-item fill-dot icon="mdi-update" small v-for="comment in commentList" :key="comment._id">
                                <div>
                                    <span class="text-caption">{{ dayjs(comment.updatedDate).format('YYYY/MM/DD HH:mm') }}</span>
                                </div>
                                <div class="mt-5" style="display: flex; flex-wrap: wrap">
                                    <div style="display: flex; flex-grow: 1; justify-content: center; align-items: flex-start; width: 150px">
                                        <AuthorProfile :author="comment.user" />
                                    </div>
                                    <div style="flex-grow: 3; width: 320px;">
                                        <v-sheet color="defualt" elevation="1" tile>
                                            <v-container>
                                                <pre style="white-space: pre-wrap; word-wrap: break-word">{{ comment.comment }}</pre>
                                            </v-container>
                                        </v-sheet>
                                    </div>
                                </div>
                            </v-timeline-item>
                        </v-timeline>
                        <div class="mt-5" v-if="commentListPagination.totalPage > 1">
                            <div style="display: flex; justify-content: flex-end">
                                <v-pagination v-model="page" :length="commentListPagination.totalPage" />
                            </div>
                        </div>
                    </div>
                    <div class="text-center" v-else>
                        {{ $t('messages.blog.view.noCommentYet') }}
                    </div>
                    <div class="mt-10">
                        <div style="display: flex; flex-wrap: wrap" v-if="$store.state.authentication.jwt">
                            <div style="display: flex; flex-grow: 1; justify-content: center; align-items: flex-start; width: 150px">
                                <AuthorProfile :author="$store.state.user.user" />
                            </div>
                            <div style="flex-grow: 3; width: 320px;">
                                <v-textarea
                                    v-model="comment"
                                    rows="4"
                                    append-icon="mdi-send"
                                    outlined
                                    auto-grow
                                    @click:append="handleSendCommentButtonClick"
                                    :error-messages="commentRequiredMessage"
                                    :placeholder="$t('messages.blog.view.commentPlaceHolder')"
                                />
                            </div>
                        </div>
                        <div class="text-center" v-else>
                            <span class="font-weight-black" style="cursor: pointer" @click="redirectToLogin">{{ $t('pages.blog.commentLogin') }}</span> {{ $t('pages.blog.leaveComment') }}
                        </div>
                    </div>
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
            </main>
        </div>
    </div>
</template>
<script>
    import AuthorProfile from '../../../components/authorProfile';
    import FunctionButton from '../../../components/functionButton';
    import SideBar from '../../../components/sideBar';
    const dayjs = require('dayjs');

    export default {
        components: {
            AuthorProfile, FunctionButton, SideBar
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
                // get author's fans
                response = await $axios.get(`${process.env.userApi}/follows/${blog['userId']}/fans`);
                const { followList } = response.data.payload;
                // get author blogs amount
                response = await $axios.get(`${process.env.blogApi}/blogs/user/${blog['userId']}/amount`);
                const { amount } = response.data.payload;
                const blogsAmount = amount;
                // get collectionList
                let collectionList = [];
                if (headers) {
                    response = await $axios.get(`${process.env.commentApi}/collections`, { headers });
                    collectionList = response.data.payload;
                }
                // get comments list
                response = await $axios.get(`${process.env.commentApi}/comments/blog/${params.blogId}?page=1&perPage=10`);
                const commentList = response.data.payload.commentList;
                const commentListPagination = response.data.payload.pagination;
                // get comments amount
                response = await $axios.get(`${process.env.commentApi}/comments/blog/${params.blogId}/amount`);
                const comments = response.data.payload;
                // check liked
                let liked = false;
                const userId = store.state.authentication.userId;
                if (userId) {
                    response = await $axios.get(`${process.env.commentApi}/likes/blog/${params.blogId}/user/${store.state.authentication.userId}`);
                    liked = response.data.payload.liked;
                }
                // get likes amount
                response = await $axios.get(`${process.env.commentApi}/likes/blog/${params.blogId}/amount`);
                const likes = response.data.payload;
                return {
                    author, blog, blogsAmount, collectionList, commentList, commentListPagination, comments, followList, liked, likes
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
                collectionName: '',
                collectionNameRequiredMessage: null,
                selected: [],
                comment: '',
                commentRequiredMessage: null,
                page: 1,
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
            async handleSendCommentButtonClick() {
                const comment = String(this.comment).trim();
                if (!comment) {
                    this.commentRequiredMessage = this.$t('messages.blog.form.commentRequired');
                    return
                }
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const postData = {
                        comment,
                        blogId: this.$route.params.blogId
                    }
                    await this.$axios.post(`${process.env.commentApi}/comments`, postData);
                    // reset data
                    this.page = 1;
                    this.comment = '';
                    await this.getCommentList();
                    await this.getCommentsAmount();
                    // show comment sent tip
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar:{
                            open: true,
                            color: 'success',
                            message: this.$t(`messages.blog.general.leaveCommentSuccess`)
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
            async getCommentList() {
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const response = await this.$axios.get(`${process.env.commentApi}/comments/blog/${this.$route.params.blogId}?page=${this.page}&perPage=10`);
                    this.commentList = response.data.payload.commentList;
                    this.commentListPagination = response.data.payload.pagination;
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
                title: `${this.$t('headers.viewBlogPage')} - ${this.blog.title}`
            }
        },
        watch: {
            collectionName() {
                this.collectionNameRequiredMessage = null;
            },
            comment() {
                this.commentRequiredMessage = null;
            },
            page() {
                this.getCommentList();
            }
        }
    }
</script>