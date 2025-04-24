import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {getAllConversationsByUserIdService, createChatSingle, createChatGroup } from '../../api/chatApi' 

const initialState = {
    conversations: [],
    conversation: null,
    membersGroup: [],
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

const createConversationGroup = createAsyncThunk('conversation/createConversationGroup', async (request, thunkAPI) => {
    try {
        const response = await createChatGroup(request);
        return response;
    } catch (error) {
        console.error("Error creating conversation group:", error.response?.data || error.message);
        return thunkAPI.rejectWithValue(error.response.data?.message || error.message);
    }
});

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        setSelectedConversationId(state, action) {
            state.conversationId = action.payload;
        },
        setConversationsGroup(state, action) {
            const newConversation = action.payload;

            // Cập nhật lại conversation khi thành viên rời khỏi nhóm
            const indexConversation = state.conversations.findIndex((item) => item.id === newConversation?.id);

            // Nếu tìm thấy conversation trong danh sách, cập nhật lại thông tin
            if(indexConversation !== -1) {
                state.conversations[indexConversation].members = newConversation.members;
            }

            // Nếu tìm thấy conversation trong danh sách, cập nhật lại thông tin
            if (newConversation && !state.conversations.find((item) => item.id === newConversation.id)) {
              state.conversations.push(newConversation);
            }
        },

        updateGroupMembers(state, action) {
            const { conversationId, members } = action.payload;
            const conversationIndex = state.conversations.findIndex(
                (conversation) => conversation.id === conversationId
            );
            if (conversationIndex !== -1) {
                state.conversations[conversationIndex].members = members; 
                state.membersGroup = members;
            }

        },

        updateConversationName(state, action) {
            const { conversationId, name } = action.payload;
            const conversationIndex = state.conversations.findIndex(
                (conversation) => conversation.id === conversationId
            );
            if (conversationIndex !== -1) {
                state.conversations[conversationIndex].name = name;
            }
        },
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

        //createConversationGroup
        builder.addCase(createConversationGroup.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(createConversationGroup.fulfilled, (state, action) => {
            const newConversation = action.payload;
            if(newConversation && !state.conversations.find((item) => item.id === newConversation.id)) {
                state.conversation = newConversation;
                state.conversations.push(newConversation);
            }
            state.isLoading = false;
        })
        builder.addCase(createConversationGroup.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export const {setSelectedConversationId, setConversationsGroup, updateGroupMembers } = conversationSlice.actions;
export { getAllConversationsByUserId, createConversation, createConversationGroup };
export default conversationSlice.reducer;