import type { RootState } from "../index";

export const selectEvents = (state: RootState) => state.event.events;
export const selectStaffEvents = (state: RootState) => state.event.staffEvents;
export const selectCurrentEvent = (state: RootState) => state.event.currentEvent;
export const selectEventLoading = (state: RootState) => state.event.loading;
export const selectEventError = (state: RootState) => state.event.error;
