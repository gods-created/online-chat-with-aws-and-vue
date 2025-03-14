<template>
    <div class="row g-3 align-center justify-center h-100 p-3">
        <div class="col-lg-4 col-md-12 col-sm-12 align-center justify-center">
            <v-sheet class="mx-auto border p-3 rounded-3 shadow" width="300">
                <v-form>
                    <v-text-field
                        class="mb-2"
                        v-model="form.firstName.value"
                        :rules="form.firstName.rules"
                        label="First name"
                    ></v-text-field>

                    <v-textarea
                        v-model="form.message.value"
                        :rules="form.message.rules"
                        label="Message"
                    ></v-textarea>

                    <v-btn class="mt-2" type="submit" @click.prevent="send_message" block>Send message</v-btn>
                </v-form>
            </v-sheet>
        </div>

        <div class="col-lg-8 col-md-12 col-sm-12 align-center justify-center">
            <v-sheet class="mx-auto border p-3 rounded-3 shadow">
                <SpinnerComponent  v-if="loading" />
                <v-table
                    v-else
                    height="400px"
                    fixed-header
                >
                    <thead>
                        <tr>
                            <th class="text-left fw-bold fs-4">
                                First name
                            </th>
                            <th class="text-left fw-bold fs-4">
                                Message
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="item in messages"
                            :key="item.id"
                        >
                            <td style="width: 250px;">{{ item.firstName }}</td>
                            <td style="width: calc(100% - 250px);">{{ item.message }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-sheet>
        </div>
    </div>
</template>

<script>
    import { loading_chat_messages } from '@/mixins/api.js';
    import { reactive, ref, onBeforeMount } from 'vue';
    import SpinnerComponent from '@/components/layouts/SpinnerComponent.vue';

    export default {
        name: 'ChatComponent',
        props: {
            socket: Promise,
        },
        components: {
            SpinnerComponent,
        },
        emits: [],
        setup(props, { emit }) {
            let loading = ref(true);
            let messages = reactive([]);

            onBeforeMount(async () => {
                const loading_chat_messages_result = await loading_chat_messages();
                messages.push(...loading_chat_messages_result);
                loading.value = false;
            });

            let form = reactive({
                firstName: {
                    value: '',
                    rules: [
                        value => value ? true : 'The \'First name\' field can\'t be empty!'
                    ]
                },
                message: {
                    value: '',
                    rules: [
                        value => value ? true : 'The \'Message\' field can\'t be empty!'
                    ]
                }
            });

            let send_message = () => {
                const firstName = form.firstName.value;
                const message = form.message.value;

                if (!firstName || !message) {
                    return;
                }

                const action = 'sender';

                if (props.socket) {
                    props.socket.send(JSON.stringify({ action, firstName, message }));
                } else {
                    console.error('WebSocket is not initialized!');
                }
            };

            if (props.socket) {
                props.socket.addEventListener('message', (event) => {
                    const data = JSON.parse(event.data);
                    const { firstName, message } = data;
                    messages.unshift({ firstName, message });
                });
            }

            return { form, messages, send_message, loading };
        }
    }
</script>