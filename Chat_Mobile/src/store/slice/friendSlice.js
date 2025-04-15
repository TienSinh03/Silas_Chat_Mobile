import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {  acceptFriendReq, getFriendReqReceived, getFriendReqSent, recallFriendReq, rejectFriendReq, sendFriendReq } from "../../api/friendApi";
import { getFriendList } from "../../api/userApi";
const initialState = {
    friends: [],
    friend: null,
    sentRequests: [],
    receivedFriendRequests: [],
    isLoading: true,
    error: null,
}; 

const getMyFriends = createAsyncThunk('friend/getMyFriends', getFriendList);
const getReqsReceived = createAsyncThunk('friend/getReqsReceived', getFriendReqReceived);
const getReqsSent = createAsyncThunk('friend/getReqsSent', getFriendReqSent);
const recallReq = createAsyncThunk('friend/recallReq', recallFriendReq);
const acceptReq = createAsyncThunk('friend/acceptReq', acceptFriendReq);
const rejectReq = createAsyncThunk('friend/rejectReq', rejectFriendReq);
const sendReq = createAsyncThunk('friend/sendReq', sendFriendReq);


const friendSlice = createSlice({
    name: "friend",
    initialState,
    reducers: {
        setFriends(state, action) {
            state.friends = action.payload;
        },
        setFriend(state, action) {
            state.friend = action.payload;
        },
        setSentRequests(state, action) {
            state.sentRequests = action.payload;
        },
        setReceivedFriendRequests(state, action) {
            state.receivedFriendRequests = action.payload;
        },
    },
    extraReducers: (builder) => {
        //getMyFriends
        builder.addCase(getMyFriends.pending, (state) => {})
        builder.addCase(getMyFriends.fulfilled, (state, action) => {
            state.friends = action.payload.response;
            state.isLoading = false;
        })
        builder.addCase(getMyFriends.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        //getReqsReceived
        builder.addCase(getReqsReceived.pending, (state) => {
        });
        builder.addCase(getReqsReceived.fulfilled, (state, action) => {
            state.receivedFriendRequests = action.payload.response;
            state.isLoading = false;
        })
        builder.addCase(getReqsReceived.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        //getReqsSent
        builder.addCase(getReqsSent.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getReqsSent.fulfilled, (state, action) => {
            state.sentRequests = action.payload.response;
            state.isLoading = false;
        });
        builder.addCase(getReqsSent.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        //send request
        builder.addCase(sendReq.pending, (state) => {
        });
        builder.addCase(sendReq.fulfilled, (state, action) => {
            state.isLoading = false;
            state.sentRequests = [...state.sentRequests, action.payload.response];
        });
        builder.addCase(sendReq.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        //recall request
        builder.addCase(recallReq.pending, (state) => {
        });
        builder.addCase(recallReq.fulfilled, (state, action) => {
            state.isLoading = false;
            state.sentRequests = state.sentRequests.filter(item => item.requestId !== action.payload );
        });
        builder.addCase(recallReq.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        //accept request
        builder.addCase(acceptReq.pending, (state) => {
        });
        builder.addCase(acceptReq.fulfilled, (state, action) => {
            state.isLoading = false;
            state.receivedFriendRequests = state.receivedFriendRequests.filter(item => item.requestId !== action.payload );
            state.friends = [...state.friends, action.payload.response];
        })
        builder.addCase(acceptReq.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        //reject request
        builder.addCase(rejectReq.pending, (state) => {
        });
        builder.addCase(rejectReq.fulfilled, (state, action) => {
            state.isLoading = false;
            state.receivedFriendRequests = state.receivedFriendRequests.filter(item => item.requestId !== action.payload );
        })
        builder.addCase(rejectReq.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
    }
})

export const { setFriends, setFriend, setSentRequests, setReceivedFriendRequests } = friendSlice.actions;
export { getMyFriends, getReqsReceived, getReqsSent, rejectReq, recallReq, acceptReq, sendReq };
export default friendSlice.reducer;