import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCurrentUser } from "../../api/userApi";


const getProfile = createAsyncThunk('user/fetchCurrentUser', getCurrentUser);

const initialState = {
    user: null,
    isLoading: true,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProfile.pending, (state) => {
        })
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoading = false;
        });
        builder.addCase(getProfile.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
    }
})

export { getProfile };
export default userSlice.reducer;

