import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Reservation, SpendEntry } from "../../types/booking";
import {
  createReservation,
  getAllReservations,
  getAllSpendEntries,
  getMyReservations,
  getMyReservationById,
  getReservationById,
  getSpendEntryById,
  logSpendEntry,
  verifyReservationPayment,
  verifySpendPayment,
} from "./bookingThunks";

export interface BookingState {
  reservations: Reservation[];
  spendEntries: SpendEntry[];
  currentReservation: Reservation | null;
  currentSpendEntry: SpendEntry | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  reservations: [],
  spendEntries: [],
  currentReservation: null,
  currentSpendEntry: null,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingError(state) {
      state.error = null;
    },
    clearCurrentReservation(state) {
      state.currentReservation = null;
    },
    clearCurrentSpendEntry(state) {
      state.currentSpendEntry = null;
    },
  },
  extraReducers: (builder) => {
    // createReservation
    builder
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state) => {
        state.loading = false;
        // The response just gives checkout details, so no full reservation is added here
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to create reservation.";
      });

    // verifyReservationPayment
    builder
      .addCase(verifyReservationPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyReservationPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReservation = action.payload;
        // Optionally update it in the list if it exists
        const index = state.reservations.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        } else {
          state.reservations.unshift(action.payload);
        }
      })
      .addCase(verifyReservationPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to verify reservation payment.";
      });

    // getMyReservations
    builder
      .addCase(getMyReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(getMyReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to fetch reservations.";
      });

    // getMyReservationById
    builder
      .addCase(getMyReservationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyReservationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReservation = action.payload;
      })
      .addCase(getMyReservationById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to fetch reservation details.";
      });

    // getAllReservations
    builder
      .addCase(getAllReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(getAllReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to fetch all reservations.";
      });

    // getReservationById
    builder
      .addCase(getReservationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReservationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReservation = action.payload;
      })
      .addCase(getReservationById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to fetch reservation.";
      });

    // getAllSpendEntries
    builder
      .addCase(getAllSpendEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSpendEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.spendEntries = action.payload;
      })
      .addCase(getAllSpendEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to fetch spend entries.";
      });

    // getSpendEntryById
    builder
      .addCase(getSpendEntryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSpendEntryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSpendEntry = action.payload;
      })
      .addCase(getSpendEntryById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to fetch spend entry.";
      });

    // logSpendEntry
    builder
      .addCase(logSpendEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logSpendEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSpendEntry = action.payload;
        state.spendEntries.unshift(action.payload);
      })
      .addCase(logSpendEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to log spend entry.";
      });

    // verifySpendPayment
    builder
      .addCase(verifySpendPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifySpendPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSpendEntry = action.payload;
        const index = state.spendEntries.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.spendEntries[index] = action.payload;
        } else {
          state.spendEntries.unshift(action.payload);
        }
      })
      .addCase(verifySpendPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to verify spend payment.";
      });
  },
});

export const { clearBookingError, clearCurrentReservation, clearCurrentSpendEntry } = bookingSlice.actions;
export default bookingSlice.reducer;
