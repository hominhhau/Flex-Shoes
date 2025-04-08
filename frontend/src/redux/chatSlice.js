import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {ApiManager} from '../../apis/ApiManager'

const initialState = {
    message: [],
    senders: [],
};

export const getMessages = createAsyncThunk('auth/getMessages', async (senderId, thunkAPI) => {
    let response = await ApiManager.post(`http://localhost:8080/show`, { senderId });
    return response.DT;
});

export const sendMessages = createAsyncThunk('auth/sendMessages', async ({ clientId, senderId, message }, thunkAPI) => {
    let response = await ApiManager.post('http://localhost:8080/send', { clientId, senderId, message });
    return response.DT;
});

export const getAllSender = createAsyncThunk('auth/getAllSender', async (thunkAPI) => {
    let response = await ApiManager.get('http://localhost:8080/getAllSender');
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
    },
});

// Export actions
export const {} = chatSlice.actions;

// Export reducer
export default chatSlice.reducer;
