import { configureStore } from "@reduxjs/toolkit";
import notifReducer from "./notifSlice";

export const notifStore = configureStore({
    reducer: {
        notify: notifReducer,
    },
});