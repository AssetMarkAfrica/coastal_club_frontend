import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ClubEvent, EventRSVP } from "../../types/event";
import {
  getEvents,
  getEventById,
  rsvpToEvent,
  cancelEventRSVP,
  getAllEvents,
  getStaffEventById,
  createEvent,
  updateEvent,
  deactivateEvent,
} from "./eventThunks";

export interface EventState {
  events: ClubEvent[];
  staffEvents: ClubEvent[];
  currentEvent: ClubEvent | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  staffEvents: [],
  currentEvent: null,
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    clearEventError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Member: getEvents
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Member: getEventById
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Member: rsvpToEvent
      .addCase(rsvpToEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rsvpToEvent.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update currentEvent if we are viewing it
        if (state.currentEvent && state.currentEvent.id === action.payload.event_id) {
          state.currentEvent.is_user_rsvped = true;
          state.currentEvent.rsvp_count += 1;
        }

        // Update within public events list
        const eventIndex = state.events.findIndex((e) => e.id === action.payload.event_id);
        if (eventIndex !== -1) {
          state.events[eventIndex].is_user_rsvped = true;
          state.events[eventIndex].rsvp_count += 1;
        }
      })
      .addCase(rsvpToEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Member: cancelEventRSVP
      .addCase(cancelEventRSVP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelEventRSVP.fulfilled, (state, action) => {
        state.loading = false;
        const eventId = action.payload;

        if (state.currentEvent && state.currentEvent.id === eventId) {
          state.currentEvent.is_user_rsvped = false;
          state.currentEvent.rsvp_count = Math.max(0, state.currentEvent.rsvp_count - 1);
        }

        const eventIndex = state.events.findIndex((e) => e.id === eventId);
        if (eventIndex !== -1) {
          state.events[eventIndex].is_user_rsvped = false;
          state.events[eventIndex].rsvp_count = Math.max(0, state.events[eventIndex].rsvp_count - 1);
        }
      })
      .addCase(cancelEventRSVP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Staff: getAllEvents
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.staffEvents = action.payload;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Staff: getStaffEventById
      .addCase(getStaffEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaffEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(getStaffEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Staff: createEvent
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally insert it at the front of staffEvents
        state.staffEvents.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Staff: updateEvent
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        if (state.currentEvent && state.currentEvent.id === updated.id) {
          state.currentEvent = updated;
        }

        const staffIndex = state.staffEvents.findIndex((e) => e.id === updated.id);
        if (staffIndex !== -1) {
          state.staffEvents[staffIndex] = updated;
        }

        const publicIndex = state.events.findIndex((e) => e.id === updated.id);
        if (publicIndex !== -1) {
          state.events[publicIndex] = updated;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Staff: deactivateEvent
      .addCase(deactivateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const eventId = action.payload;

        if (state.currentEvent && state.currentEvent.id === eventId) {
          state.currentEvent.is_active = false;
        }

        const index = state.staffEvents.findIndex((e) => e.id === eventId);
        if (index !== -1) {
          state.staffEvents[index].is_active = false;
        }
      })
      .addCase(deactivateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearEventError, clearCurrentEvent } = eventSlice.actions;

export default eventSlice.reducer;
