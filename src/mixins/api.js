import axios from 'axios';
import { useStore } from 'vuex';

export async function loading_chat_messages() {
    try {
        const store = useStore();
        const url = store.getters.get_messages_api_url;
        const request = await axios.get(url);
        const response = request.data;
        return response.reverse();
    } catch (error) {
        console.error(error.message);
        return [];
    }
}