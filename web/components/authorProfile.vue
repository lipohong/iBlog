<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
            <div v-if="author" style="display: flex; align-items: center">
                <v-avatar @click="redirectToAuthorProfile" style="cursor: pointer;" size="35" :color="secondaryColor" v-bind="attrs" v-on="on">
                    <img v-if="author.userInfo.avatar" :src="author.userInfo.avatar" style="object-fit: cover;">
                    <span class="white--text" v-else>{{ author.username[0] }}</span>
                </v-avatar>
                <div class="ma-2" v-bind="attrs" v-on="on">
                    <div @click="redirectToAuthorProfile" style="cursor: pointer; wordBreak: break-word">{{ author.username }}</div>
                </div>
            </div>
        </template>
        {{ $t('pages.blog.viewProfile') }}
    </v-tooltip>
</template>
<script>
    const dayjs = require('dayjs');

    export default {
        props: ['author'],
        data() {
            return {
                thresholds: this.$vuetify.breakpoint.thresholds
            }
        },
        methods: {
            redirectToAuthorProfile() {
                this.$router.push({
                    name: `blog-user-userId___${this.$i18n.locale}`,
                    params: {
                        userId: this.author._id
                    }
                });
            }
        },
        computed: {
            primaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'primary' : 'default';
            },
            secondaryColor() {
                return this.$store.state.mode.mode === 'light' ? 'secondary' : 'primary';
            }
        }
    }
</script>