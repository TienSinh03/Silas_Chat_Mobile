import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, updateProfile } from "../../api/userApi";


const getProfile = createAsyncThunk('user/fetchCurrentUser', getCurrentUser);

const updateUserProfile = createAsyncThunk('user/updateProfile', updateProfile);

const initialState = {
    user: null,
    isLoading: true,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUserProfileSuccess(state, action) {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        //getProfile
        builder.addCase(getProfile.pending, (state) => {
        })
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.user = action.payload.response;
            state.isLoading = false;
        });
        builder.addCase(getProfile.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        })
        //updateUserProfile
        builder.addCase(updateUserProfile.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            state.user = {...state.user, ...action.payload.response};
            state.isLoading = false;
        })
        builder.addCase(updateUserProfile.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        })

    }
})

export { getProfile, updateUserProfile };
export const { updateUserProfileSuccess } = userSlice.actions;
export default userSlice.reducer;

