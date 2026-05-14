import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import membershipReducer from "./membership/membershipSlice";
import paymentReducer from "./payment/paymentSlice";
import profileReducer from "./profile/profileSlice";

import cardReducer from "./membership/cardSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    membership: membershipReducer,
    payment: paymentReducer,
    card: cardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
