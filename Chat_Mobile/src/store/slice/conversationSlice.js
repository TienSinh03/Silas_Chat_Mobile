import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {getAllConversationsByUserIdService, getMessagesByConversationIdService, sendMessageService} from '../../api/chatApi' 

const initialState = {
    conversations: [],
    conversation: null,
    error: null,
    isLoading: true,
}; 

const getAllConversationsByUserId = createAsyncThunk('conversation/getAllConversationsByUserId', getAllConversationsByUserIdService);

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getAllConversationsByUserId.pending, (state) => {
        })
        builder.addCase(getAllConversationsByUserId.fulfilled, (state, action) => {
            state.conversations = action.payload;
            state.isLoading = false;
        })
        builder.addCase(getAllConversationsByUserId.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export const { } = conversationSlice.actions;
export { getAllConversationsByUserId };
export default conversationSlice.reducer;