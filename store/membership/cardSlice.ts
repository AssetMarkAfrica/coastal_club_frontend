import {createSlice} from '@reduxjs/toolkit';
import {getMyMembershipCard} from "./cardThunks";
import type {MembershipCard} from "../../types/membership";


export interface CardState {
  card: MembershipCard | null;
  loading: boolean;
  error: string | null;
}
const initialState: CardState = {
  card: null,
  loading: false,
  error: null,
};
const cardSlice = createSlice({
  name: "card",
  initialState,
    reducers: {
        clearCardError(state) {
            state.error = null;
        },
        clearCardState(state) {
            state.card = null;
            state.loading = false;
        }
    },
  extraReducers: (builder) => {
    builder      .addCase(getMyMembershipCard.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
      .addCase(getMyMembershipCard.fulfilled, (state, action) => {
        state.loading = false;
        state.card = action.payload;
      })
      .addCase(getMyMembershipCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    },
});

export const {clearCardError, clearCardState} = cardSlice.actions;
export default cardSlice.reducer;