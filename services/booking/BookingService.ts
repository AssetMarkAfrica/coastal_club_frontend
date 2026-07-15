import api from "../utils/api";
import type { ApiResponse } from "../../types/api";
import type {
  Reservation,
  SpendEntry,
  CreateReservationPayload,
  CreateReservationResponse,
  VerifyReservationPayload,
  LogSpendPayload,
  VerifySpendPayload,
  MemberReservation,
  CreateMemberReservationPayload,
} from "../../types/booking";

const BASE = process.env.NEXT_PUBLIC_BOOKING_API;

export const createReservation = (payload: CreateReservationPayload) =>
  api.post<ApiResponse<CreateReservationResponse>>(`${BASE}/non-members/`, payload);

export const verifyReservationPayment = (payload: VerifyReservationPayload) =>
  api.post<ApiResponse<Reservation>>(`${BASE}/non-members/verify/`, payload);

export const getMyReservations = () =>
  api.get<ApiResponse<Reservation[]>>(`${BASE}/non-members/me/`);

export const getMyReservationById = (id: string) =>
  api.get<ApiResponse<Reservation>>(`${BASE}/non-members/me/${id}/`);

export const getAllReservations = (params?: Record<string, string>) =>
  api.get<ApiResponse<Reservation[]>>(`${BASE}/staff/reservations/`, { params });

export const getReservationById = (id: string) =>
  api.get<ApiResponse<Reservation>>(`${BASE}/staff/reservations/${id}/`);

export const createMemberReservation = (payload: CreateMemberReservationPayload) =>
  api.post<ApiResponse<MemberReservation>>(`${BASE}/members/`, payload);

export const getMyMemberReservations = () =>
  api.get<ApiResponse<MemberReservation[]>>(`${BASE}/members/me/`);

export const getMyMemberReservationById = (id: string) =>
  api.get<ApiResponse<MemberReservation>>(`${BASE}/members/me/${id}/`);

export const getAllMemberReservations = (params?: Record<string, string>) =>
  api.get<ApiResponse<MemberReservation[]>>(`${BASE}/staff/member-reservations/`, { params });

export const getMemberReservationById = (id: string) =>
  api.get<ApiResponse<MemberReservation>>(`${BASE}/staff/member-reservations/${id}/`);

export const getAllSpendEntries = (params?: Record<string, string>) =>
  api.get<ApiResponse<SpendEntry[]>>(`${BASE}/staff/spend-entries/`, { params });

export const getSpendEntryById = (id: string) =>
  api.get<ApiResponse<SpendEntry>>(`${BASE}/staff/spend-entries/${id}/`);

export const logSpendEntry = (payload: LogSpendPayload) =>
  api.post<ApiResponse<SpendEntry>>(`${BASE}/staff/spend/`, payload);

export const verifySpendPayment = (payload: VerifySpendPayload) =>
  api.post<ApiResponse<SpendEntry>>(`${BASE}/staff/spend/verify/`, payload);
