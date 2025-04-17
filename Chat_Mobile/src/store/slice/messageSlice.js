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

            // Dùng để cập nhật lại khi xóa message tại bất kỳ vị trí nào
            // Lấy index của message đã tồn tại trong mảng
            const indexMessage = state.messages.findIndex(msg => msg?.id === action.payload?.id);

            
            if(indexMessage !== -1) {
                // Nếu tồn tại thì cập nhật lại message
                state.messages[indexMessage] = action.payload;
            }

            // some() kiểm tra xem có tồn tại message id trong mảng hay không
            // Nếu không tồn tại thì thêm mới message vào mảng
            if (!state.messages.some(msg => msg?.id === action.payload?.id)) {
                state.messages.push(action.payload);
            }
        },
        setMessagesUpdate: (state, action) => {
            state.messages = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        deleteMessage(state, action) {
            state.messages = state.messages.filter(message => message.id !== action.payload.id);
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

export const { setMessagesUpdate, clearMessages, addMessage, deleteMessage } = messageSlice.actions;
export { getAllMessagesByConversationId, sendMessageToUser };
export default messageSlice.reducer;