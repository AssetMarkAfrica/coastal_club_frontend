import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import membershipReducer from "./membership/membershipSlice";
import paymentReducer from "./payment/paymentSlice";
import profileReducer from "./profile/profileSlice";
import notificationReducer from "./notification/notificationSlice";
import bookingReducer from "./booking/bookingSlice";
import searchReducer from "./search/searchSlice";
import eventReducer from "./event/eventSlice";

import cardReducer from "./membership/cardSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    membership: membershipReducer,
    payment: paymentReducer,
    card: cardReducer,
    notification: notificationReducer,
    booking: bookingReducer,
    search: searchReducer,
    event: eventReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
