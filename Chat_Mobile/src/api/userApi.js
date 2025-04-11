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

export async function updateProfile(formData) {
    
    console.log("formData");
    console.log(formData._parts);
    try {
        const response = await instance.put('/api/v1/user/me/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("response");
        console.log(response.data);
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

export async function changePassword(data) {
    try {
        const response = await instance.put('/api/v1/user/change-password', data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", error.response.data);
        } else {
            console.log("Other error:", error.message);
        }
        throw error;
    }
}
