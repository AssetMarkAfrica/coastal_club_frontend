import { createAsyncThunk } from "@reduxjs/toolkit";
import * as eventService from "../../services/event/EventService";
import type { CreateEventPayload, UpdateEventPayload } from "../../types/event";

const getErrorMessage = (error: unknown, fallback: string) => {
    const err = error as {
        response?: {
            data?: {
                detail?: string;
                message?: string;
            };
        };
    };

    return err.response?.data?.detail ?? err.response?.data?.message ?? fallback;
};

// ---------------------------------------------------------------------------
// Member / public
// ---------------------------------------------------------------------------

export const getEvents = createAsyncThunk(
    "event/getEvents",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await eventService.getEvents();
            return data.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to fetch events."));
        }
    }
);

export const getEventById = createAsyncThunk(
    "event/getEventById",
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await eventService.getEventById(id);
            return data.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to fetch event details."));
        }
    }
);

export const rsvpToEvent = createAsyncThunk(
    "event/rsvpToEvent",
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await eventService.rsvpToEvent(id);
            return data.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to RSVP to event."));
        }
    }
);

// The cancel endpoint returns no `data`, so the thunk resolves with the
// event id itself — the slice uses it to find and update the right event.
export const cancelEventRSVP = createAsyncThunk(
    "event/cancelEventRSVP",
    async (id: string, { rejectWithValue }) => {
        try {
            await eventService.cancelEventRSVP(id);
            return id;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to cancel RSVP."));
        }
    }
);

// ---------------------------------------------------------------------------
// Staff / admin
// ---------------------------------------------------------------------------

export const getAllEvents = createAsyncThunk(
    "event/getAllEvents",
    async (params: Record<string, string> | undefined, { rejectWithValue }) => {
        try {
            const { data } = await eventService.getAllEvents(params);
            return data.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to fetch all events."));
        }
    }
);

export const getStaffEventById = createAsyncThunk(
    "event/getStaffEventById",
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await eventService.getStaffEventById(id);
            return data.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to fetch event details."));
        }
    }
);

export const createEvent = createAsyncThunk(
    "event/createEvent",
    async (payload: CreateEventPayload, { rejectWithValue }) => {
        try {
            const { data } = await eventService.createEvent(payload);
            return data.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to create event."));
        }
    }
);

export const updateEvent = createAsyncThunk(
    "event/updateEvent",
    async (
        { id, payload }: { id: string; payload: UpdateEventPayload },
        { rejectWithValue }
    ) => {
        try {
            const { data } = await eventService.updateEvent(id, payload);
            return data.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to update event."));
        }
    }
);

// The deactivate endpoint returns no `data`, so the thunk resolves with the
// event id itself — the slice uses it to find and update the right event.
export const deactivateEvent = createAsyncThunk(
    "event/deactivateEvent",
    async (id: string, { rejectWithValue }) => {
        try {
            await eventService.deactivateEvent(id);
            return id;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to deactivate event."));
        }
    }
);