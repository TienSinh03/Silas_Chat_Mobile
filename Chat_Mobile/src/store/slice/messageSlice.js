import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {getMessagesByConversationIdService, sendMessageService} from '../../api/chatApi' 

const initialState = {
    messages: [],
    message: null,
    error: null,
    isLoading: true,
}; 

const getAllMessagesByConversationId = createAsyncThunk('conversation/getAllMessagesByConversationId', getMessagesByConversationIdService);

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {

        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllMessagesByConversationId.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getAllMessagesByConversationId.fulfilled, (state, action) => {
            state.messages = action.payload.response;
            state.isLoading = false;
        })
        builder.addCase(getAllMessagesByConversationId.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        //sendMessage
        // builder.addCase(sendMessageService.pending, (state) => {
        //     state.isLoading = true;
        // })
        // builder.addCase(sendMessageService.fulfilled, (state, action) => {
        //     state.messages.push(action.payload.response);
        //     state.isLoading = false;
        // })
        // builder.addCase(sendMessageService.rejected, (state, action) => {
        //     state.isLoading = false;
        //     state.error = action.error.message;
        // })
    }
})

export const { setMessages, clearMessages } = messageSlice.actions;
export { getAllMessagesByConversationId };
export default messageSlice.reducer;