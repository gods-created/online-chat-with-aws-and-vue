<template>
    <div class='d-flex h-100 w-100 align-center justify-center'>
        <v-btn
        :loading="loading"
        @click="connection"
        >
        Connect to chat

        <template v-slot:loader>
            <v-progress-linear indeterminate></v-progress-linear>
        </template>
        </v-btn>
    </div>
</template>

<script>
    import { ref } from 'vue';

    export default {
        name: 'ConnectionButtonComponent',
        props: {
            loading: Boolean,
        },
        emits: [
            'open_chat'
        ],
        setup(props, { emit }) {
            let connection = () => {
                emit('open_chat');
            }

            return { connection };
        }
    }
</script>