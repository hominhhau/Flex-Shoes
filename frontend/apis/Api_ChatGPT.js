import { ApiManager } from './ApiManager';

export const Api_ChatGPT = {

    chatgpt: async (message) => {
        const shortDescription = message
        try {
            const response = await ApiManager.post('/inventory/chatgpt', { shortDescription });
            return response;
        } catch (error) {
            console.error('Error fetching ChatGPT response:', error);
            throw error;
        }
    },
};