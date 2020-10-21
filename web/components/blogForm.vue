<template>
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
                        outlined
                    />
                    <v-select class="ml-2 action" v-model="action" :items="actionOptions" :label="$t('pages.blog.action')" outlined />
                </div>
                <div>
                    <span>{{ $t('pages.blog.cover') }}</span>
                    
                    <div style="display: flex; justify-content: center">
                        <div @click="uploadCover" class="text-center" style="width: 480px; height: 270px; border: dashed 2px #aaa; cursor: pointer; line-height: 270px">
                            <img v-if="cover" :src="cover" style="height: 100%; object-fit: cover;" />
                            <div v-else>{{ $t('pages.blog.uploadCover') }} <v-icon>mdi-cloud-upload</v-icon></div>
                        </div>
                        <v-tooltip v-if="cover" bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-bind="attrs" v-on="on" @click="handleRemoveCoverButtonClick" icon small>
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </template>
                            {{ $t('pages.blog.removeCover') }}
                        </v-tooltip>
                    </div>
                </div>
                <div class="mt-4 text-right">
                    <v-btn :color="primaryColor" @click="handleDiscardButtonClick" outlined>{{ $t('pages.blog.discard') }}<v-icon>mdi-delete</v-icon></v-btn>
                    <v-btn :color="primaryColor" @click="handleSubmit">{{ $t('pages.common.submit') }}<v-icon>mdi-upload</v-icon></v-btn>
                </div>
                <DicardBlogDialog :open="dialogOpen" />
            </div>
        </v-sheet>
    </v-container>
</template>
<script>
    import DicardBlogDialog from './dicardBlogDialog';
    export default {
        props: ['blog'],
        data () {
            return {
                cover: '',
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
        computed: {
            primaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'primary' : 'default';
            },
            secondaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'secondary' : 'primary';
            }
        },
        components: { DicardBlogDialog },
        methods: {
            onEditorReady(quill) {
                this.quill = quill;
                if (this.blog) {
                    this.cover = this.blog['cover'];
                    this.title = this.blog['title'];
                    this.quill.setContents(this.blog['content']);
                    this.categories = this.blog['categories'];
                    this.action = this.blog['status'];
                }
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
                            const postData = new FormData();
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
            async uploadCover() {
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
                            this.cover = `${process.env.fileApi}/files/${data.payload.fileId}`;
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
            handleRemoveCoverButtonClick() {
                this.cover = '';
            },
            async handleSubmit() {
                if (!this.$refs.title.validate()) return
                const content = this.quill.getContents().ops;
                const postData = {
                    cover: this.cover,
                    title: this.title,
                    content,
                    categories: this.categories,
                    status: this.action
                }
                this.$store.dispatch('global/setProgressBar', { progressBar: true });
                try {
                    if (this.$route.params.blogId) {
                        // update blog
                        await this.$axios.put(`${process.env.blogApi}/blogs/${this.$route.params.blogId}`, postData);
                        this.$store.dispatch('global/setSnackBar', {
                            snackBar:{
                                open: true,
                                color: 'success',
                                message: this.action === 'published' ? this.$t(`messages.blog.general.publishBlogSuccess`) : this.$t(`messages.blog.general.saveBlogSuccess`) 
                            }
                        });
                        this.$router.push({ name: `blog___${this.$i18n.locale}` });
                    } else {
                        // create blog
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
            handleDiscardButtonClick() {
                this.dialogOpen = true;
            }
        }
    }
</script>