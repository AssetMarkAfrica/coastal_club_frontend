import type { MembershipCardResponse } from '@/types/membership';
import api from "../utils/api";

const BASE = process.env.NEXT_PUBLIC_CARD_API;

export const getMembershipCard = () =>
  api.get<MembershipCardResponse>(`${BASE}/me`);