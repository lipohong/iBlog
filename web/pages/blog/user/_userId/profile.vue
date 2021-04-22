<template>
    <section class="blog">
        <SideBar :author="author" :selectedItem="1" :followList="followList" :blogsAmount="blogsAmount" />
        <div class="profileViewingContainer">
            <v-progress-linear class="separateBar" value="100" :color="secondaryColor"></v-progress-linear>
            <article class="ql-snow">
                <main class="ql-editor" v-html="author.userInfo.description || `<div>${ $t('pages.blog.noDescriptionMessage') }</div>`"></main>
            </article>
            <v-progress-linear class="separateBar" value="100" :color="secondaryColor"></v-progress-linear>
        </div>
    </section>
</template>
<script>
    import * as _ from 'lodash';
    const htmlToText = require('html-to-text');

    export default {
        async asyncData({ params, $axios, redirect, app }) {
            try {
                // get author info
                let response = await $axios.get(`${process.env.userApi}/users/${params.userId}`);
                const author = response.data.payload;
                // get author's fans
                response = await $axios.get(`${process.env.userApi}/follows/${params.userId}/fans`);
                const { followList } = response.data.payload;
                // get author's blogs
                response = await $axios.get(`${process.env.blogApi}/blogs/user/${params.userId}?page=1&perPage=10`);
                let { blogList, pagination } = response.data.payload;
                blogList = blogList.map(blog => {
                    // conver html to plain string
                    blog.content = htmlToText.fromString(blog.content, { wordwrap: false, uppercaseHeadings: false, ignoreHref: true, tags: { 'img': { format: 'skip' } } });
                    // limit length of title
                    blog.title = _.truncate(blog.title, { 'length': 50, 'omission': '...' });
                    // limit length of content
                    blog.content = _.truncate(blog.content, { 'length': 200, 'omission': '...'});

                    return blog
                })
                // get author blogs amount
                response = await $axios.get(`${process.env.blogApi}/blogs/user/${params.userId}/amount`);
                const { amount } = response.data.payload;
                const blogsAmount = amount;

                return {
                    author, followList, blogList, pagination, blogsAmount
                }
            } catch (err) {
                redirect(`/${app.i18n.locale}/auth/login`);
            }
        },
        data() {
            return {

            }
        },
        computed: {
            primaryColor() {

                return this.$store.state.mode.mode === 'light' ? 'primary' : 'default';
            },
            secondaryColor() {

                return this.$store.state.mode.mode === 'light' ? 'secondary' : 'primary';
            },
        },
        head() {
            return {
                title: this.$t('headers.authorProfilePage')
            }
        }
    }
</script>