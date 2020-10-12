<template>
    <v-dialog :value="open" persistent max-width="400">
        <v-card>
            <v-card-title>
                {{ title }}
            </v-card-title>
            <v-card-text>{{ text }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="default" outlined @click="handdleDialogClose">{{ $t('pages.common.cancel') }}</v-btn>
                <v-btn color="error" v-if="handdleDialogReject" @click="handdleDialogReject">{{ $t('pages.common.reject') }}</v-btn>
                <v-btn color="success" @click="handdleDialogConfirm">{{ $t('pages.common.confirm') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        props: ['open', 'title', 'text', 'handdleDialogReject', 'handdleDialogConfirm'],
        methods: {
            handdleDialogClose() {
                this.$parent.$parent.dialogOpen = false;
            }
        }
    }
</script>