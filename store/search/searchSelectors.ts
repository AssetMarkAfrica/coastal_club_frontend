import type { RootState } from "../index";

export const selectSearchState = (state: RootState) => state.search;
export const selectMemberSearchResults = (state: RootState) => state.search.members;
export const selectCurrentSearchMember = (state: RootState) =>
  state.search.currentMember;
export const selectMemberSearchPagination = (state: RootState) =>
  state.search.pagination;
export const selectMemberSearchParams = (state: RootState) =>
  state.search.lastParams;
export const selectMemberSearchLoading = (state: RootState) =>
  state.search.loading;
export const selectMemberSearchDetailLoading = (state: RootState) =>
  state.search.detailLoading;
export const selectMemberSearchError = (state: RootState) => state.search.error;

export const selectReservationSearchResults = (state: RootState) => state.search.reservations;
export const selectCurrentSearchReservation = (state: RootState) => state.search.currentReservation;
export const selectReservationSearchPagination = (state: RootState) => state.search.reservationPagination;
export const selectReservationSearchParams = (state: RootState) => state.search.lastReservationParams;
export const selectReservationSearchLoading = (state: RootState) => state.search.reservationLoading;
export const selectReservationSearchDetailLoading = (state: RootState) => state.search.reservationDetailLoading;
