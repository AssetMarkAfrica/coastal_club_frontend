import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  MemberSearchParams,
  MemberSearchResult,
  ReservationSearchParams,
  ReservationSearchResult,
  SearchPagination,
} from "../../types/search";
import { 
  getMemberSearchDetail, 
  searchMembers,
  searchReservations,
  getReservationSearchDetail
} from "./searchThunks";

export interface SearchState {
  members: MemberSearchResult[];
  currentMember: MemberSearchResult | null;
  pagination: SearchPagination | null;
  lastParams: MemberSearchParams | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;

  reservations: ReservationSearchResult[];
  currentReservation: ReservationSearchResult | null;
  reservationPagination: SearchPagination | null;
  lastReservationParams: ReservationSearchParams | null;
  reservationLoading: boolean;
  reservationDetailLoading: boolean;
}

const initialState: SearchState = {
  members: [],
  currentMember: null,
  pagination: null,
  lastParams: null,
  loading: false,
  detailLoading: false,
  error: null,

  reservations: [],
  currentReservation: null,
  reservationPagination: null,
  lastReservationParams: null,
  reservationLoading: false,
  reservationDetailLoading: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearchError(state) {
      state.error = null;
    },
    clearMemberSearchResults(state) {
      state.members = [];
      state.pagination = null;
      state.lastParams = null;
    },
    clearCurrentSearchMember(state) {
      state.currentMember = null;
    },
    setSearchParams(state, action: PayloadAction<MemberSearchParams | null>) {
      state.lastParams = action.payload;
    },
    clearReservationSearchResults(state) {
      state.reservations = [];
      state.reservationPagination = null;
      state.lastReservationParams = null;
    },
    clearCurrentSearchReservation(state) {
      state.currentReservation = null;
    },
    setReservationSearchParams(state, action: PayloadAction<ReservationSearchParams | null>) {
      state.lastReservationParams = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMembers.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastParams = action.meta.arg ?? null;
      })
      .addCase(searchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to search members.";
      });

    builder
      .addCase(getMemberSearchDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(getMemberSearchDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentMember = action.payload;

        const index = state.members.findIndex(
          (member) => member.user_id === action.payload.user_id
        );
        if (index !== -1) {
          state.members[index] = action.payload;
        }
      })
      .addCase(getMemberSearchDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload ?? "Failed to fetch member details.";
      });

    builder
      .addCase(searchReservations.pending, (state, action) => {
        state.reservationLoading = true;
        state.error = null;
        state.lastReservationParams = action.meta.arg ?? null;
      })
      .addCase(searchReservations.fulfilled, (state, action) => {
        state.reservationLoading = false;
        state.reservations = action.payload.results;
        state.reservationPagination = action.payload.pagination;
      })
      .addCase(searchReservations.rejected, (state, action) => {
        state.reservationLoading = false;
        state.error = action.payload ?? "Failed to search reservations.";
      });

    builder
      .addCase(getReservationSearchDetail.pending, (state) => {
        state.reservationDetailLoading = true;
        state.error = null;
      })
      .addCase(getReservationSearchDetail.fulfilled, (state, action) => {
        state.reservationDetailLoading = false;
        state.currentReservation = action.payload;

        const index = state.reservations.findIndex(
          (reservation) => reservation.reservation_id === action.payload.reservation_id
        );
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      })
      .addCase(getReservationSearchDetail.rejected, (state, action) => {
        state.reservationDetailLoading = false;
        state.error = action.payload ?? "Failed to fetch reservation details.";
      });
  },
});

export const {
  clearCurrentSearchMember,
  clearMemberSearchResults,
  clearSearchError,
  setSearchParams,
  clearReservationSearchResults,
  clearCurrentSearchReservation,
  setReservationSearchParams,
} = searchSlice.actions;

export default searchSlice.reducer;
