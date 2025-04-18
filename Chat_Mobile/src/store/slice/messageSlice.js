import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {getMessagesByConversationIdService, sendMessageService} from '../../api/chatApi' 
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    messages: [],
    deletedMessageIds: [],
    message: null,
    error: null,
    isLoading: true,
}; 

// const getAllMessagesByConversationId = createAsyncThunk('conversation/getAllMessagesByConversationId', getMessagesByConversationIdService);
 const getAllMessagesByConversationId = createAsyncThunk(
    'conversation/getAllMessagesByConversationId',
    async (conversationId, { getState }) => {
        
        // lấy deletedMessageIds từ state
      const { message: { deletedMessageIds } } = getState();
    //   AsyncStorage.removeItem(`deletedMessages_${conversationId}`);
        console.log("deletedMessageIds: ", deletedMessageIds); 

      // lấy ra danh sách deletedMessageIds theo conversationId
      const deletedIds = deletedMessageIds[conversationId] || [];

      const response = await getMessagesByConversationIdService(conversationId);

      // Lọc tin nhắn đã xóa trước khi trả về
      return {
        response: response.response.filter(msg => !deletedIds.includes(msg?.id)),
        conversationId,
      };
    }
  );


const sendMessageToUser = createAsyncThunk('conversation/sendMessage', sendMessageService);



const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        addMessage(state, action) {

             // Không thêm tin nhắn nếu nó đã bị xóa phía mình
            

            // Dùng để cập nhật lại khi xóa message tại bất kỳ vị trí nào
            // Lấy index của message đã tồn tại trong mảng
            const indexMessage = state.messages.findIndex(msg => msg?.id === action.payload?.id);

            
            if(indexMessage !== -1) {
                // Nếu tồn tại thì cập nhật lại message
                state.messages[indexMessage] = action.payload;
            }

            // some() kiểm tra xem có tồn tại message id trong mảng hay không
            // Nếu không tồn tại thì thêm mới message vào mảng
            const deletedId = state.deletedMessageIds[action.payload.conversationId] || [];

            if (deletedId.includes(action.payload?.id)) {
                return;
            }
            
            // Kiểm tra xem message đã bị xóa trước đó chưa
            if (!state.messages.some(msg => msg?.id === action.payload?.id) ) {
                // if(!deletedId.includes(action.payload?.id)) {
                    state.messages.push(action.payload);
                // }
            }
        },
        setMessagesUpdate: (state, action) => {
            state.messages = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        deleteMessage(state, action) {
            const { id, conversationId } = action.payload;
            state.messages = state.messages.filter(message => message.id !== action.payload.id);

            // Kiểm tra xem conversationId đã tồn tại trong deletedMessageIds chưa
            if(!state.deletedMessageIds[conversationId]) {
                state.deletedMessageIds[conversationId] = [];
            }
            // them messageId vào mảng deletedMessageIds
            state.deletedMessageIds[conversationId].push(id);

            // Lưu deletedMessageIds vào AsyncStorage
            AsyncStorage.setItem(`deletedMessages_${conversationId}`, JSON.stringify(state.deletedMessageIds[conversationId]));
        },
        
        loadDeletedMessageIds: (state, action) => {
            const { conversationId, deletedMessageIds } = action.payload;
            state.deletedMessageIds[conversationId] = deletedMessageIds;
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

export const { setMessagesUpdate, clearMessages, addMessage, deleteMessage, loadDeletedMessageIds } = messageSlice.actions;
export { getAllMessagesByConversationId, sendMessageToUser };
export default messageSlice.reducer;


export const loadDeletedMessageIdsAsync = (conversationId) => async (dispatch) => {
    try {
      const deletedMessageIds = await AsyncStorage.getItem(`deletedMessages_${conversationId}`);
        console.log("deletedMessageIds: ", deletedMessageIds);
      if (deletedMessageIds) {
        dispatch(loadDeletedMessageIds({ conversationId, deletedMessageIds: JSON.parse(deletedMessageIds) }));
      }
    } catch (error) {
      console.error('Lỗi khi tải deletedMessageIds:', error);
    }
  };