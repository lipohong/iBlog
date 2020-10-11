<template>
    <div class="blog">
        <v-container>
            <v-sheet color="defualt" elevation="1" rounded>
                <no-ssr>
                    <quill-editor
                        ref="editor"
                        v-model="content"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)"
                    />
                </no-ssr>
            </v-sheet>
            
        </v-container>
    </div>
</template>
<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

    import { quillEditor } from 'vue-quill-editor'

    export default {
        components: {
            quillEditor
        },
        data () {
            return {
                content: '<p>I am Example</p>',
                editorOption: {
                    // Some Quill options...
                    theme: 'snow',
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block']
                        ]
                    }
                }
            }
        },
        methods: {
            onEditorBlur(editor) {
                console.log('editor blur!', editor)
            },
            onEditorFocus(editor) {
                console.log('editor focus!', editor)
            },
            onEditorReady(editor) {
                console.log('editor ready!', editor)
            }
        },
        mounted() {
            // console.log('App inited, the Quill instance object is:', this.$refs.editor.quill)
            setTimeout(() => {
                this.content = 'I was changed!'
            }, 3000)
        },
        computed: {
            primaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'primary' : 'default';
            },
            secondaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'secondary' : 'primary';
            }
        },
        head() {
            return {
                title: this.$t('headers.createBlogPage')
            }
        },
    }
</script>