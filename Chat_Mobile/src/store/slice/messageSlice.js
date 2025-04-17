import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {getMessagesByConversationIdService, sendMessageService} from '../../api/chatApi' 

const initialState = {
    messages: [],
    message: null,
    error: null,
    isLoading: true,
}; 

const getAllMessagesByConversationId = createAsyncThunk('conversation/getAllMessagesByConversationId', getMessagesByConversationIdService);
const sendMessageToUser = createAsyncThunk('conversation/sendMessage', sendMessageService);

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        addMessage(state, action) {
            state.messages.push(action.payload);
        },
        setMessagesUpdate: (state, action) => {
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
        builder.addCase(sendMessageToUser.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(sendMessageToUser.fulfilled, (state, action) => {
            state.messages.push(action.payload.response);
            state.isLoading = false;
        })
        builder.addCase(sendMessageToUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export const { setMessagesUpdate, clearMessages, addMessage } = messageSlice.actions;
export { getAllMessagesByConversationId, sendMessageToUser };
export default messageSlice.reducer;