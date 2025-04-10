import instance from "./axios";

export async function getCurrentUser() {
    
    try {
        const response = await instance.get('/api/v1/user/me');
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", error.response.data); // << cái này sẽ cho biết lý do 400
          } else {
            console.log("Other error:", error.message);
          }
          throw error;
    }
}