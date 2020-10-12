<template>
    <div class="blog mt-5 mb-10">
        <v-container class="editorContainer" :style="`max-width: ${thresholds.sm}px`">
            <v-sheet class="pa-5" color="defualt" elevation="1" rounded>
                <v-form ref="title" v-model="valid" lazy-validation>
                    <v-text-field v-model="title" :rules="titleRules" :placeholder="$t(`messages.blog.form.titlePlaceHolder`)" dense></v-text-field>
                </v-form>
                <client-only>
                    <quill-editor
                        class="mt-4"
                        ref="editor"
                        v-model="content"
                        :options="editorOption"
                        @ready="onEditorReady($event)"
                    />
                </client-only>
                <div class="mt-5">
                    <div class="categoriesActionContainer">
                        <v-select
                            class="categories"
                            v-model="categories"
                            :items="categoriesOptions"
                            :label="$t('pages.blog.categories.categories')"
                            multiple
                            chips
                            outlined
                        />
                        <v-select class="ml-2 action" v-model="action" :items="actionOptions" :label="$t('pages.blog.action')" outlined />
                    </div>
                    <div class="text-right">
                        <v-btn :color="primaryColor" @click="handleDiscard" outlined>{{ $t('pages.blog.discard') }}</v-btn>
                        <v-btn :color="primaryColor" @click="handleSubmit">{{ $t('pages.common.submit') }}</v-btn>
                    </div>
                    <componetDialog :open="dialogOpen" :title="dialogTitle" :text="dialogText" :handdleDialogConfirm="handdleDialogConfirm" />
                </div>
            </v-sheet>
        </v-container>
    </div>
</template>
<script>
    import ComponetDialog from '../../components/componetDialog';
    export default {
        data () {
            return {
                title: '',
                titleRules: [
                    v => !!v || this.$t('messages.blog.form.titleRequired')
                ],
                content: '',
                quill: null,
                editorOption: {
                    theme: 'snow',
                    placeholder: this.$t(`messages.blog.form.contentPlaceHolder`),
                    modules: {
                        toolbar: {
                            container: [
                                [{ 'font': [] }],
                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                ['blockquote', 'code-block'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                [{ 'indent': '-1'}, { 'indent': '+1' }],
                                [{ 'direction': 'rtl' }],
                                [{ 'color': [] }, { 'background': [] }],
                                [{ 'align': [] }],
                                ['link'],
                                ['image'],
                                ['clean']
                            ],
                            handlers: {
                                'image': this.uploadImage
                            }
                        }
                    }
                },
                categories: [],
                categoriesOptions: [
                    'dataStructure',
                    'algorithm',
                    'designPattern',
                    'programming',
                    'frontend',
                    'html',
                    'css',
                    'js',
                    'ts',
                    'jest',
                    'framework',
                    'UIlibrary',
                    'backend',
                    'devOps',
                    'networking',
                    'life',
                    'other'
                ].map(option => ({
                    value: option,
                    text: this.$t(`pages.blog.categories.${option}`)
                })),
                action: 'published',
                actionOptions: [
                    {
                        value: 'published',
                        text: this.$t('pages.blog.publish')
                    },
                    {
                        value: 'draft',
                        text: this.$t('pages.blog.saveAsDraft')
                    }
                ],
                valid: true,
                thresholds: this.$vuetify.breakpoint.thresholds,
                dialogOpen: false,
                dialogTitle: '',
                dialogText: '',
                handdleDialogConfirm: null
            }
        },
        methods: {
            onEditorReady(quill) {
                this.quill = quill;
            },
            async uploadImage() {
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
                            const avatar = `${process.env.fileApi}/files/${data.payload.fileId}`;
                            const range = this.quill.getSelection();
                            if (range) {
                                this.quill.insertEmbed(range.index, 'image', avatar);
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
                    }
                }
            },
            async handleSubmit() {
                if (!this.$refs.title.validate()) return
                const content = this.quill.getContents().ops;
                const postData = {
                    title: this.title,
                    content,
                    categories: this.categories,
                    status: this.action
                }
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    const { data } = await this.$axios.post(`${process.env.blogApi}/blogs`, postData);
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar:{
                            open: true,
                            color: 'success',
                            message: this.action === 'published' ? this.$t(`messages.blog.general.publishBlogSuccess`) : this.$t(`messages.blog.general.saveBlogSuccess`) 
                        }
                    });
                    this.$router.push({
                        name: `blog-blogId___${this.$i18n.locale}`,
                        params: {
                            blogId: data.payload._id
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
            async handleDiscard() {
                this.dialogOpen = true;
                this.dialogTitle = this.$t('messages.common.dialogTitleWarning'),
                this.dialogText= this.$t('messages.blog.general.discardBlogWarning'),
                this.handdleDialogConfirm = () => {
                    const from = this.$route.query.from;
                    if (!!from && from !== '/zh/auth/login' && from !== '/en/auth/login') {
                        this.$router.push({ path: `${from}` });
                    } else {
                        this.$router.push({ path: `/${this.$i18n.locale}` });
                    }
                }
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
        components: { ComponetDialog },
        head() {
            return {
                title: this.$t('headers.createBlogPage')
            }
        }
    }
</script>