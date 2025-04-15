import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slice/userSlice';
import friendSlice  from './slice/friendSlice';

const store = configureStore({
    reducer: {
      user: userSlice,
      friend: friendSlice,
    }, 
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
  });

export default store;