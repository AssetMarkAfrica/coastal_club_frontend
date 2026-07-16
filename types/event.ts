import type { ApiResponse } from "./api";

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export enum EventRSVPStatus {
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
}

export interface ClubEvent {
    id: string;
    title: string;
    description: string;
    event_date: string; // "YYYY-MM-DD"
    event_time: string; // "HH:MM:SS"
    location: string;
    image: string | null;
    max_attendees: number;
    is_members_only: boolean;
    is_active: boolean;
    rsvp_count: number;
    is_user_rsvped: boolean;
    created_at: string;
    updated_at: string;
}

export interface EventRSVP {
    id: string;
    event_id: string;
    user_id: string;
    status: EventRSVPStatus;
    created_at: string;
}

// ---------------------------------------------------------------------------
// Member / public endpoints
// ---------------------------------------------------------------------------

// GET {{EVENT_API}}/
export type EventsListResponse = ApiResponse<ClubEvent[]>;

// GET {{EVENT_API}}/{{event_id}}/
export type EventDetailResponse = ApiResponse<ClubEvent>;

// POST {{EVENT_API}}/{{event_id}}/rsvp/  (no request body)
export type RSVPToEventResponse = ApiResponse<EventRSVP>;

// DELETE {{EVENT_API}}/{{event_id}}/rsvp/  (no request body, no `data` in response)
export type CancelRSVPResponse = ApiResponse<null>;

// ---------------------------------------------------------------------------
// Staff / admin endpoints
// ---------------------------------------------------------------------------

export interface CreateEventPayload {
    title: string;
    description: string;
    event_date: string; // "YYYY-MM-DD"
    event_time: string; // "HH:MM:SS"
    location: string;
    image?: File | null; // send as multipart/form-data when present
    max_attendees: number;
    is_members_only: boolean;
    is_active: boolean;
}

// PUT is treated as partial on the backend (serializer uses partial=True),
// so any subset of CreateEventPayload's fields is valid.
export type UpdateEventPayload = Partial<CreateEventPayload>;

// POST {{EVENT_API}}/staff/events/
export type CreateEventResponse = ApiResponse<ClubEvent>;

// PUT {{EVENT_API}}/staff/events/{{event_id}}/
export type UpdateEventResponse = ApiResponse<ClubEvent>;

// DELETE {{EVENT_API}}/staff/events/{{event_id}}/  (no `data` in response)
export type DeactivateEventResponse = ApiResponse<null>;

// GET {{EVENT_API}}/staff/events/
export type StaffEventsListResponse = ApiResponse<ClubEvent[]>;

// GET {{EVENT_API}}/staff/events/{{event_id}}/
export type StaffEventDetailResponse = ApiResponse<ClubEvent>;