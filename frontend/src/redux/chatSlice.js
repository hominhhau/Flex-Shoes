import { ApiManager } from '../../apis/ApiManager';


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiManager } from '../../apis/ApiManager';

const initialState = {
    message: [],
    senders: [],
    lastMessages: [],
};

export const getMessages = createAsyncThunk('auth/getMessages', async (senderId, thunkAPI) => {
    let response = await ApiManager.post(`http://localhost:8089/show`, { senderId });
    return response.DT;
});

export const sendMessages = createAsyncThunk('auth/sendMessages', async ({ clientId, senderId, message }, thunkAPI) => {
    let response = await ApiManager.post('http://localhost:8089/send', { clientId, senderId, message });
    return response.DT;
});

export const getAllSender = createAsyncThunk('auth/getAllSender', async (thunkAPI) => {
    let response = await ApiManager.get('http://localhost:8089/getAllSender');
    return response;
});

export const getLastMessage = createAsyncThunk('auth/getLastMessage', async (senderIds, thunkAPI) => {
    let response = await ApiManager.get(`http://localhost:8089/getLastMessage?senderIds=${senderIds}`);
    return response;
});

export const updateMessageStatus = createAsyncThunk('auth/updateMessageStatus', async (senderId, thunkAPI) => {
    let response = await ApiManager.post(`http://localhost:8089/updateMessageStatus`, senderId);
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

        //  getAllSender
        builder
            .addCase(getAllSender.pending, (state) => {})
            .addCase(getAllSender.fulfilled, (state, action) => {
                state.senders = action.payload || [];
            })
            .addCase(getAllSender.rejected, (state, action) => {});

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
    },
});

// Export actions
export const {} = chatSlice.actions;

// Export reducer
export default chatSlice.reducer;
