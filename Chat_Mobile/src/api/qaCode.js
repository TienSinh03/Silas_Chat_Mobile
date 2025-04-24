// api/qaCode.js
import axios from './axios'; // cấu hình axios baseURL ở đây

export const saveQaCode = async (sessionId, userId) => {
    try {
      const res = await axios.post(`/api/v1/qacode/save`, null, {
        params: { sessionId , userId},
      });
      return res.status === 200;
    } catch (error) {
      console.error('Lỗi gửi mã QR:', error);
      return false;
    }
  };
  