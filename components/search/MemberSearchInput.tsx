"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, XCircle, Loader2, CreditCard } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { searchMembers } from "../../store/search/searchThunks";
import { selectMemberSearchResults, selectMemberSearchLoading } from "../../store/search/searchSelectors";
import type { MemberSearchResult } from "../../types/search";
import { clearMemberSearchResults } from "../../store/search/searchSlice";

interface MemberSearchInputProps {
  onSelect: (member: MemberSearchResult) => void;
}

export default function MemberSearchInput({ onSelect }: MemberSearchInputProps) {
  const dispatch = useAppDispatch();
  const results = useAppSelector(selectMemberSearchResults);
  const isLoading = useAppSelector(selectMemberSearchLoading);
  
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
      dispatch(searchMembers({ q: debouncedQuery, is_active: true }));
      setShowResults(true);
    } else {
      dispatch(clearMemberSearchResults());
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

  const handleSelect = (m: MemberSearchResult) => {
    onSelect(m);
    setQuery("");
    setShowResults(false);
    dispatch(clearMemberSearchResults());
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
        placeholder="Search by member email, name, or phone number…"
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
            dispatch(clearMemberSearchResults());
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
            <p className="text-center text-sm text-[#6B7280] py-4">No members found.</p>
          ) : (
            results.map((m) => (
              <button
                key={m.user_id}
                onClick={() => handleSelect(m)}
                disabled={!m.can_charge || !m.card.token}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F8F1DF] transition-colors border-b border-[#EDE3CC] last:border-0 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div>
                  <p className="text-sm font-medium text-[#10243F]">{m.full_name || m.email}</p>
                  <p className="text-xs text-[#6B7280] font-mono">{m.member_number}</p>
                </div>
                <div className="text-right">
                  {!m.can_charge ? (
                    <p className="text-xs text-red-500 uppercase tracking-wider mb-0.5">Cannot Charge</p>
                  ) : !m.card.token ? (
                    <p className="text-xs text-red-500 uppercase tracking-wider mb-0.5">No Card</p>
                  ) : (
                    <>
                      <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-0.5">Credit Remaining</p>
                      <p className="text-sm font-bold text-[#0F766E] flex items-center justify-end gap-1">
                        GHS {((m.subscription?.spend_credit_remaining_pesewas || 0) / 100).toFixed(2)}
                      </p>
                    </>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
