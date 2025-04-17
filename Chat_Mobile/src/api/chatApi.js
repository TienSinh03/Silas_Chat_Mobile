import instance from "./axios";

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