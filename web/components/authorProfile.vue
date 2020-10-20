<template>
    <div>
        <div v-if="author" style="display: flex; align-items: center">
            <v-avatar @click="redirectToAuthorProfile" style="cursor: pointer;" size="35" :color="secondaryColor">
                <img v-if="author.avatar" :src="author.avatar" style="object-fit: cover;">
                <span class="white--text" v-else>{{ author.username[0] }}</span>
            </v-avatar>
            <div class="ma-2" >
                <div @click="redirectToAuthorProfile" style="cursor: pointer; wordBreak: break-word">{{ author.username }}</div>
            </div>
        </div>
    </div>
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
                    name: `user-profile-userId___${this.$i18n.locale}`,
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