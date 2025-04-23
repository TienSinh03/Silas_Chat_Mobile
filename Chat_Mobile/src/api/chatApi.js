import instance from "./axios";

export const createChatSingle = async (request) => {
  try {
    const response = await instance.post(
      "/api/v1/conversations/createConversationOneToOne",
      request
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating conversation:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Lỗi khi tạo hội thoại");
  }
};

export const createChatGroup = async (request) => {
  try {
    const response = await instance.post(
      "/api/v1/conversations/createConversationGroup",
      request
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating conversation:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Lỗi khi tạo hội thoại");
  }
};

export const getAllConversationsByUserIdService = async () => {
  try {
    const response = await instance.get(
      "/api/v1/conversations/getAllConversationsByUserId"
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching conversations:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách hội thoại"
    );
  }
};

export const getMessagesByConversationIdService = async (conversationId) => {
  console.log("conversationId api: ", conversationId);
  try {
    const response = await instance.get(`/api/v1/messages/${conversationId}`);
    // console.log("Response data:");
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching messages:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách tin nhắn"
    );
  }
};

export const sendMessageService = async (messageData) => {
  console.log("messageData api: ", messageData);
  try {
    const response = await instance.post("/api/v1/messages", messageData);
    // console.log("Response data:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Lỗi khi gửi tin nhắn");
  }
};

export const deleteMessageForUserService = async (messageId, userId) => {
  try {
    const response = await instance.post("/api/v1/messages/delete-for-user", {
      messageId,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting message:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Lỗi khi xóa tin nhắn");
  }
};

export const uploadFile = async (formData) => {
  try {
    const response = await instance.post("/api/v1/messages/upload-img", formData, {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
  });
    return response.data;
  } catch (error) {
    console.error(
      "Error uploading file:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Lỗi khi xóa tin nhắn");
  }
};

// Function to forward a message
export const forwardMessage = async ({ messageId, senderId, receiverId, content, messageType, fileUrl, additionalMessage }) => {
  try {
    const response = await instance.post('/api/v1/messages/forward', {
      messageId,
      senderId,
      receiverId,
      content: content || '', 
      messageType: messageType || 'TEXT',
      fileUrl: fileUrl || null, 
      additionalMessage: additionalMessage || null, 
    });
    return response.data;
  } catch (error) {
    console.error('Error forwarding message:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi chuyển tiếp tin nhắn");
  }
};

export const leaveGroup = async (conversationId) => {
  try {
    const response = await instance.delete(
      `/api/v1/conversations/leave/${conversationId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error leaving group:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Lỗi khi rời nhóm");
  }
}