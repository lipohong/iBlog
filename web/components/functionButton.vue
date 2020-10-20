<template>
    <div class="text-right">
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
            {{ liked ? $t('pages.blog.disLike') : $t('pages.blog.like') }}
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="copyLink">
                    <v-icon>mdi-share</v-icon>
                </v-btn>
            </template>
            {{ $t('pages.blog.share') }}
        </v-tooltip>
    </div>
</template>
<script>
    export default {
        props: ['collected', 'liked', 'handleCollectButtonClick', 'handLikeButtonClick'],
        methods: {
            copyLink() {
                const textarea = document.createElement("textarea");
                textarea.textContent = window.location.href;
                textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand("copy");  // Security exception may be thrown by some browsers.
                    // copy link success tips
                    this.$store.dispatch('global/setSnackBar', {
                        snackBar: {
                            open: true,
                            color: 'success',
                            message: this.$t(`messages.blog.general.copyLinkSuccess`)
                        }
                    });
                    return true;
                }
                catch (err) {
                    console.warn("Copy to clipboard failed.", err);
                    return false;
                }
                finally {
                    document.body.removeChild(textarea);
                }
            }
        }
    }
</script>