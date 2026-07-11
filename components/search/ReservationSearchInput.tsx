"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, XCircle, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { searchReservations } from "../../store/search/searchThunks";
import { selectReservationSearchResults, selectReservationSearchLoading } from "../../store/search/searchSelectors";
import type { ReservationSearchResult } from "../../types/search";
import { clearReservationSearchResults } from "../../store/search/searchSlice";

interface ReservationSearchInputProps {
  onSelect: (reservation: ReservationSearchResult) => void;
}

export default function ReservationSearchInput({ onSelect }: ReservationSearchInputProps) {
  const dispatch = useAppDispatch();
  const results = useAppSelector(selectReservationSearchResults);
  const isLoading = useAppSelector(selectReservationSearchLoading);
  
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce the input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Execute search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      dispatch(searchReservations({ q: debouncedQuery, status: "confirmed" }));
      setShowResults(true);
    } else {
      dispatch(clearReservationSearchResults());
      setShowResults(false);
    }
  }, [debouncedQuery, dispatch]);

  // Close results on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (r: ReservationSearchResult) => {
    onSelect(r);
    setQuery("");
    setShowResults(false);
    dispatch(clearReservationSearchResults());
  };

  return (
    <div className="relative group w-full" ref={containerRef}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] group-focus-within:text-[#10243F] transition-colors" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => {
          if (query.trim().length >= 2) setShowResults(true);
        }}
        className="w-full bg-white border border-[#EDE3CC] rounded-lg py-4 pl-12 pr-12 text-[#1A1A1A] placeholder-[#6B7280] outline-none focus:border-[#10243F] focus:ring-1 focus:ring-[#10243F]/30 shadow-sm transition-all text-sm"
        placeholder="Search by guest email, name, or reservation ID…"
        type="text"
      />
      
      {isLoading && query.length >= 2 && (
        <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[#6B7280]" />
      )}
      
      {query && (
        <button
          onClick={() => {
            setQuery("");
            setShowResults(false);
            dispatch(clearReservationSearchResults());
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#10243F]"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}

      {showResults && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-[#EDE3CC] rounded-lg shadow-xl max-h-64 overflow-y-auto">
          {isLoading && results.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#10243F]" />
            </div>
          ) : results.length === 0 ? (
            <p className="text-center text-sm text-[#6B7280] py-4">No confirmed reservations found.</p>
          ) : (
            results.map((r) => (
              <button
                key={r.reservation_id}
                onClick={() => handleSelect(r)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F8F1DF] transition-colors border-b border-[#EDE3CC] last:border-0 text-left"
              >
                <div>
                  <p className="text-sm font-medium text-[#10243F]">{r.full_name || r.email}</p>
                  <p className="text-xs text-[#6B7280] font-mono">{r.reservation_id.slice(0, 12)}…</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-0.5">Credit</p>
                  <p className="text-sm font-bold text-[#0F766E]">
                    GHS {(r.payment.spend_credit_remaining_pesewas / 100).toFixed(2)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
