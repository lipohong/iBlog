<template>
    <div class="blog mt-5 mb-10">
        <v-container class="viewBlogContainer" :style="`max-width: ${thresholds.sm}px`">
            <div class="coverContainer mb-5" v-if="blog['cover']">
                <img class="cover" :src="blog['cover']" />
            </div>
            <div class="blogTitle" v-text="blog['title']"></div>
            <AuthorProfile :author="author" />
            <div>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon @click="handleCollectButtonClick">
                            <v-icon v-if="collected">mdi-star</v-icon>
                            <v-icon v-else>mdi-star-outline</v-icon>
                        </v-btn>
                    </template>
                    {{ $t('pages.blog.collectBlog') }}
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon @click="handLikeButtonClick">
                            <v-icon v-if="liked">mdi-cards-heart</v-icon>
                            <v-icon v-else>mdi-heart-outline</v-icon>
                        </v-btn>
                    </template>
                    {{ blog['liked'] ? $t('pages.blog.disLike') : $t('pages.blog.like') }}
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon>
                            <v-icon>mdi-share</v-icon>
                        </v-btn>
                    </template>
                    {{ $t('pages.blog.forwardToFacebook') }}
                </v-tooltip>
            </div>
            <div class="updatedDate mt-2">Last Updated: {{ dayjs(blog['updatedDate']).format('YYYY-MM-DD HH:mm:ss') }}</div>
            <div class="mt-5" v-html="blog['content']"></div>
            <AuthorProfile :author="author" />
            <v-overlay :absolute="true" :value="collectionOverlay">
                <v-container :style="`max-width: ${thresholds.xs}px`">
                    <v-sheet :color="secondaryColor" elevation="1" rounded>
                        <div>
                            <span>Collection Management</span>
                        </div>
                        <v-btn @click="collectionOverlay = false">{{ $t('pages.common.cancel') }}</v-btn>
                    </v-sheet>
                </v-container>
            </v-overlay>
        </v-container>
    </div>
</template>
<script>
    import AuthorProfile from '../../../components/authorProfile';
    const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
    const dayjs = require('dayjs');

    export default {
        components: {
            AuthorProfile
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
                const converter = new QuillDeltaToHtmlConverter(blog.content, {});
                blog.content = converter.convert();
                // get author info
                response = await $axios.get(`${process.env.userApi}/users/${blog['userId']}`);
                const author = response.data.payload;
                // get collectionList
                let collectionList = [];
                if (headers) {
                    response = await $axios.get(`${process.env.commentApi}/collections`, { headers });
                    collectionList = response.data.payload;
                }
                return {
                    blog, author, collectionList
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
            }
        },
        methods: {
            async handleCollectButtonClick() {
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                await this.getCollections();
                this.collectionOverlay = true;
                this.$store.dispatch('global/setProgressBar', { progressBar: false });
            },
            async getCollections() {
                try {
                    const { data } = await this.$axios.get(`${process.env.commentApi}/collections`);
                    this.collectionList = data.payload;
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
            },
            async handLikeButtonClick() {
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    await this.$axios.post(`${process.env.commentApi}/likes/blog/${this.$route.params.blogId}`);
                    this.liked = !this.liked;
                    // await getLikeAmount();
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
        }
    }
</script>