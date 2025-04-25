// api/qaCode.js
import axios from './axios'; // cấu hình axios baseURL ở đây
  
 /*
  import axios from './axios'; // cấu hình axios baseURL ở đây
 */

export const saveQaCode = async (sessionId, userId, token) => {
    try {
      const res = await axios.post(`/api/v1/qacode/save`, null, {
        params: { sessionId , userId, token },
      });
      return res.status === 200;
    } catch (error) {
      console.error('Lỗi gửi mã QR:', error);
      return false;
    }
};
  
 