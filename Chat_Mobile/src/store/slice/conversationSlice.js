import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {getAllConversationsByUserIdService, createChatSingle } from '../../api/chatApi' 

const initialState = {
    conversations: [],
    conversation: null,
    conversationId: null,
    error: null,
    isLoading: true,
}; 

const getAllConversationsByUserId = createAsyncThunk('conversation/getAllConversationsByUserId', getAllConversationsByUserIdService);
const createConversation = createAsyncThunk('conversation/createConversation', async (request, thunkAPI) => {
    try {
        const response = await createChatSingle(request);
        return response;
    } catch (error) {
        console.error("Error creating conversation:", error.response?.data || error.message);
        return thunkAPI.rejectWithValue(error.response.data?.message || error.message);
    }
});

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        setSelectedConversationId(state, action) {
            state.conversationId = action.payload;
        }
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

        //createConversation
        builder.addCase(createConversation.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(createConversation.fulfilled, (state, action) => {
            const newConversation = action.payload;
            if(newConversation) {
                state.conversation = newConversation;
                state.conversations.push(newConversation);
            }
            state.isLoading = false;
        })
        builder.addCase(createConversation.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export const {setSelectedConversationId } = conversationSlice.actions;
export { getAllConversationsByUserId, createConversation };
export default conversationSlice.reducer;