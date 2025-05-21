import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiManager } from '../../apis/ApiManager';

const initialState = {
    message: [],
    senders: [],
    lastMessages: [],
    allProducts: [],
};

export const getMessages = createAsyncThunk('chat/getMessages', async (senderId, thunkAPI) => {
    let response = await ApiManager.post(`/chat/show`, { senderId });
    return response.DT;
});

export const sendMessages = createAsyncThunk(
    'chat/sendMessages',
    async ({ clientId, senderId, message, type, productId }, thunkAPI) => {
        let response = await ApiManager.post('/chat/send', {
            clientId,
            senderId,
            message,
            type,
            productId,
        });
        return response.DT;
    },
);

export const chatGPT = createAsyncThunk('chat/chatGPT', async (message, thunkAPI) => {
    let response = await ApiManager.post(`/chat/chatgpt`, { message: message });
    return response;
});

export const getLastMessage = createAsyncThunk('chat/getLastMessage', async (senderIds, thunkAPI) => {
    let response = await ApiManager.get(`/chat/getLastMessage?senderIds=${senderIds}`);
    return response;
});

export const updateMessageStatus = createAsyncThunk('chat/updateMessageStatus', async (senderId, thunkAPI) => {
    let response = await ApiManager.post(`/chat/updateMessageStatus`, senderId);
    return response;
});

export const getAllProducts = createAsyncThunk('chat/getAllProducts', async (thunkAPI) => {
    let response = await ApiManager.get(`/inventory/getAllProducts`);
    return response;
});

export const getNumberOfProductsById = createAsyncThunk('chat/getNumberOfProductsById', async (id, thunkAPI) => {
    let response = await ApiManager.get(`/inventory/getNumberOfProductsById/${id}`);
    return response;
});

const chatSlice = createSlice({
    name: 'chat',
    initialState,

    extraReducers: (builder) => {
        //  getMessages
        builder
            .addCase(getMessages.pending, (state) => {})
            .addCase(getMessages.fulfilled, (state, action) => {
                state.message = action.payload || [];
            })
            .addCase(getMessages.rejected, (state, action) => {});

        //  sendMessages
        builder
            .addCase(sendMessages.pending, (state) => {})
            .addCase(sendMessages.fulfilled, (state, action) => {
                state.message = action.payload || [];
            })
            .addCase(sendMessages.rejected, (state, action) => {});

        // getLastMessage
        builder
            .addCase(getLastMessage.pending, (state) => {})
            .addCase(getLastMessage.fulfilled, (state, action) => {
                state.lastMessages = action.payload || [];
            })
            .addCase(getLastMessage.rejected, (state, action) => {});

        // updateMessageStatus
        builder
            .addCase(updateMessageStatus.pending, (state) => {})
            .addCase(updateMessageStatus.fulfilled, (state, action) => {
                state.lastMessages = action.payload || [];
            })
            .addCase(updateMessageStatus.rejected, (state, action) => {});

        // getAllProducts
        builder
            .addCase(getAllProducts.pending, (state) => {})
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.allProducts = action.payload || [];
            })
            .addCase(getAllProducts.rejected, (state, action) => {});

        // getNumberOfProductsById
        builder
            .addCase(getNumberOfProductsById.pending, (state) => {})
            .addCase(getNumberOfProductsById.fulfilled, (state, action) => {})
            .addCase(getNumberOfProductsById.rejected, (state, action) => {});

        // chatGPT
        builder
            .addCase(chatGPT.pending, (state) => {})
            .addCase(chatGPT.fulfilled, (state, action) => {})
            .addCase(chatGPT.rejected, (state, action) => {});
    },
});

// Export actions
export const {} = chatSlice.actions;

// Export reducer
export default chatSlice.reducer;
