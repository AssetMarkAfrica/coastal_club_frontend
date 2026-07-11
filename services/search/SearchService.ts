import api from "../utils/api";
import type {
  MemberSearchDetailResponse,
  MemberSearchParams,
  MemberSearchResponse,
  ReservationSearchDetailResponse,
  ReservationSearchParams,
  ReservationSearchResponse,
} from "../../types/search";

export type {
  MemberSearchCard,
  MemberSearchDetailResponse,
  MemberSearchParams,
  MemberSearchProfile,
  MemberSearchResponse,
  MemberSearchResult,
  MemberSearchSubscription,
  PaymentDetails,
  ReservationDetails,
  ReservationSearchDetailResponse,
  ReservationSearchParams,
  ReservationSearchResponse,
  ReservationSearchResult,
  SearchPagination,
} from "../../types/search";

const BASE = process.env.NEXT_PUBLIC_SEARCH_API;

const cleanParams = (params?: Record<string, any>) => {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  );
};

export const searchMembers = (params?: MemberSearchParams) =>
  api.get<MemberSearchResponse>(`${BASE}/members/`, {
    params: cleanParams(params),
  });

export const getMemberSearchDetail = (userId: string) =>
  api.get<MemberSearchDetailResponse>(`${BASE}/members/${userId}/`);

export const searchReservations = (params?: ReservationSearchParams) =>
  api.get<ReservationSearchResponse>(`${BASE}/reservations/`, {
    params: cleanParams(params),
  });

export const getReservationSearchDetail = (reservationId: string) =>
  api.get<ReservationSearchDetailResponse>(`${BASE}/reservations/${reservationId}/`);
