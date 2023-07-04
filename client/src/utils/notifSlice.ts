import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum TaskStatus {
    Delete,
    Complete,
    Add
}
interface NotifTask {
    desc: String,
    id: number,
    status: TaskStatus,
    read: boolean,
}
interface Events {
    events: Array<NotifTask> | null,
}
export const notifSlice = createSlice({
    name: "notify",
    initialState: {
        events: null,
    },
    reducers: {
        addNotif: (state: Events, action: PayloadAction<NotifTask>) => {
            state.events = state.events ? [...state.events, action.payload] : [action.payload];
        },
        deleteNotif: (state: Events, action: PayloadAction<number>) => {
            state.events?.filter(x => x.id != action.payload)
        },
    }
});

export const { addNotif, deleteNotif } = notifSlice.actions;
export default notifSlice.reducer;


