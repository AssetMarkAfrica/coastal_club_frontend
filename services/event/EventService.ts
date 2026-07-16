import api from "../utils/api";
import type { ApiResponse } from "../../types/api";
import type {
    ClubEvent,
    EventRSVP,
    CreateEventPayload,
    UpdateEventPayload,
} from "../../types/event";

const BASE = process.env.NEXT_PUBLIC_EVENT_API;

// ---------------------------------------------------------------------------
// Member / public
// ---------------------------------------------------------------------------

export const getEvents = () => api.get<ApiResponse<ClubEvent[]>>(`${BASE}/`);

export const getEventById = (id: string) =>
    api.get<ApiResponse<ClubEvent>>(`${BASE}/${id}/`);

export const rsvpToEvent = (id: string) =>
    api.post<ApiResponse<EventRSVP>>(`${BASE}/${id}/rsvp/`);

export const cancelEventRSVP = (id: string) =>
    api.delete<ApiResponse<null>>(`${BASE}/${id}/rsvp/`);

// ---------------------------------------------------------------------------
// Staff / admin
// ---------------------------------------------------------------------------

// Builds multipart form data when an `image` File is present, since the
// staff endpoints accept MultiPartParser / FormParser / JSONParser.
const buildEventFormData = (
    payload: CreateEventPayload | UpdateEventPayload
): FormData => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        formData.append(key, value instanceof File ? value : String(value));
    });
    return formData;
};

export const getAllEvents = (params?: Record<string, string>) =>
    api.get<ApiResponse<ClubEvent[]>>(`${BASE}/staff/events/`, { params });

export const getStaffEventById = (id: string) =>
    api.get<ApiResponse<ClubEvent>>(`${BASE}/staff/events/${id}/`);

export const createEvent = (payload: CreateEventPayload) => {
    const isMultipart = payload.image instanceof File;
    return api.post<ApiResponse<ClubEvent>>(
        `${BASE}/staff/events/`,
        isMultipart ? buildEventFormData(payload) : payload,
        isMultipart ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    );
};

export const updateEvent = (id: string, payload: UpdateEventPayload) => {
    const isMultipart = payload.image instanceof File;
    return api.put<ApiResponse<ClubEvent>>(
        `${BASE}/staff/events/${id}/`,
        isMultipart ? buildEventFormData(payload) : payload,
        isMultipart ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    );
};

export const deactivateEvent = (id: string) =>
    api.delete<ApiResponse<null>>(`${BASE}/staff/events/${id}/`);