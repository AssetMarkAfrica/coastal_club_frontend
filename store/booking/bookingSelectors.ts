import type { RootState } from "../index";

export const selectBookingState = (state: RootState) => state.booking;

export const selectReservations = (state: RootState) => state.booking.reservations;
export const selectCurrentReservation = (state: RootState) => state.booking.currentReservation;

export const selectSpendEntries = (state: RootState) => state.booking.spendEntries;
export const selectCurrentSpendEntry = (state: RootState) => state.booking.currentSpendEntry;

export const selectBookingLoading = (state: RootState) => state.booking.loading;
export const selectBookingError = (state: RootState) => state.booking.error;
