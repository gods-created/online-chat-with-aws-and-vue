<template>
  <v-alert v-if="alertBlock.state" class="position-fixed w-100 rounded-0 text-center text-light fw-bold bg-danger" :text="alertBlock.text"></v-alert>

  <KeepAlive>
    <component :is="component" @open_chat='open_chat' :socket="socket" :loading="loading" />
  </KeepAlive>
</template>

<script>
  import { reactive, ref } from 'vue';
  import { useStore } from 'vuex';
  import ChatComponent from '@/components/layouts/ChatComponent.vue';
  import ConnectionButtonComponent from '@/components/layouts/ConnectionButtonComponent.vue';

  export default {
    name: 'MainComponent',
    components: {
      ChatComponent,
      ConnectionButtonComponent,
    },
    setup() {
      const store = useStore();

      let component = ref('ConnectionButtonComponent');
      let socket = ref(null);
      let loading = ref(false);
      let alertBlock = reactive({
        state: false,
        text: ''
      })

      let open_chat = () => {
        loading.value = !loading.value;
        const websocket_url = store.getters.websocket_url;
        const ws = new WebSocket(websocket_url);

        ws.onopen = () => {
          socket.value = ws;
          component.value = 'ChatComponent';
          loading.value = false;
        };

        ws.onerror = (error) => {
          alertBlock.text = 'WebSocket connection error!';
          alertBlock.state = true;
          console.error('WebSocket Error:', error);
          loading.value = false;
        };

        ws.onclose = (event) => {
          console.warn('WebSocket closed:', event);
        };
        
        return;
      }

      return { component, open_chat, socket, loading, alertBlock };
    }
  }
</script>
