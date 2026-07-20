'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { MapPin, ChevronRight, Loader2 } from 'lucide-react';

interface AddressSuggestion {
  display: string;
  line1: string;
  postcode: string;
}

export function UKAddressAutocomplete() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selected, setSelected] = useState<AddressSuggestion | null>(null);
  const [error, setError] = useState('');

  // For portal positioning
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateDropdownPosition = useCallback(() => {
    if (wrapperRef.current) {
      const r = wrapperRef.current.getBoundingClientRect();
      setDropdownRect({
        top: r.bottom + window.scrollY + 8,
        left: r.left + window.scrollX,
        width: r.width,
      });
    }
  }, []);

  const search = useCallback(async (value: string) => {
    const q = value.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = new URL('https://nominatim.openstreetmap.org/search');
      url.searchParams.set('q', q);
      url.searchParams.set('countrycodes', 'gb');
      url.searchParams.set('format', 'json');
      url.searchParams.set('addressdetails', '1');
      url.searchParams.set('limit', '7');
      url.searchParams.set('dedupe', '1');

      const res = await fetch(url.toString(), {
        headers: { 'Accept-Language': 'en-GB', 'User-Agent': 'TakafulApp/1.0' },
      });
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      const mapped: AddressSuggestion[] = data.map((item: {
        display_name: string;
        address?: { postcode?: string; city?: string; town?: string; village?: string; county?: string; state?: string };
      }) => {
        const a = item.address ?? {};
        const postcode = a.postcode ?? '';
        const place = a.city ?? a.town ?? a.village ?? '';
        const county = a.county ?? a.state ?? '';
        const parts = [postcode, place, county].filter(Boolean);
        const line1 = parts.slice(0, 2).join(', ') || item.display_name.split(',')[0];
        const display = item.display_name.replace(/, United Kingdom$/, '').replace(/, England$/, '');
        return { display, line1, postcode };
      });

      updateDropdownPosition();
      setSuggestions(mapped);
      setShowDropdown(true);
      setSelectedIndex(-1);
    } catch {
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  }, [updateDropdownPosition]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelected(null);
    setError('');
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => search(val), 320);
  };

  const handleSelect = (s: AddressSuggestion) => {
    setSelected(s);
    setQuery(s.postcode || s.line1);
    setShowDropdown(false);
    setSuggestions([]);
  };

  const handleGetQuote = () => {
    const postcode = selected?.postcode || query.trim();
    if (!postcode) { setError('Please enter a UK address or postcode.'); return; }
    router.push(`/get-quote?postcode=${encodeURIComponent(postcode)}&address=${encodeURIComponent(selected?.display || postcode)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter') { e.preventDefault(); selectedIndex >= 0 ? handleSelect(suggestions[selectedIndex]) : handleGetQuote(); }
    else if (e.key === 'Escape') setShowDropdown(false);
  };

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      const t = e.target as Node;
      const portal = document.getElementById('address-dropdown-portal');
      if (!wrapperRef.current?.contains(t) && !portal?.contains(t)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Reposition on scroll / resize
  useEffect(() => {
    if (!showDropdown) return;
    const fn = () => updateDropdownPosition();
    window.addEventListener('scroll', fn, true);
    window.addEventListener('resize', fn);
    return () => { window.removeEventListener('scroll', fn, true); window.removeEventListener('resize', fn); };
  }, [showDropdown, updateDropdownPosition]);

  const dropdown = showDropdown && suggestions.length > 0 && dropdownRect
    ? createPortal(
        <div
          id="address-dropdown-portal"
          style={{
            position: 'absolute',
            top: dropdownRect.top,
            left: dropdownRect.left,
            width: dropdownRect.width,
            zIndex: 99999,
          }}
          className="bg-white rounded-2xl shadow-2xl shadow-black/20 border border-gray-100 overflow-hidden"
        >
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={() => handleSelect(s)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                i === selectedIndex ? 'bg-[#00c685]/10' : 'hover:bg-gray-50'
              } ${i !== 0 ? 'border-t border-gray-100' : ''}`}
            >
              <MapPin
                size={15}
                strokeWidth={2}
                className={`mt-0.5 shrink-0 ${i === selectedIndex ? 'text-[#00c685]' : 'text-gray-300'}`}
              />
              <div className="min-w-0">
                <span className={`block text-sm font-semibold leading-tight ${i === selectedIndex ? 'text-[#00c685]' : 'text-gray-900'}`}>
                  {s.line1}
                </span>
                <span className="block text-xs text-gray-400 truncate leading-tight mt-0.5">{s.display}</span>
              </div>
              {s.postcode && (
                <span className="ml-auto shrink-0 text-[10px] font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full self-center">
                  {s.postcode}
                </span>
              )}
            </button>
          ))}
        </div>,
        document.body
      )
    : null;

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Input pill */}
      <div className="flex items-center bg-white rounded-full p-1.5 shadow-xl shadow-black/10 w-full">
        <div className="pl-3 pr-2 shrink-0">
          {loading
            ? <Loader2 size={18} strokeWidth={2} className="animate-spin text-[#00c685]" />
            : <MapPin size={18} strokeWidth={2} className="text-gray-400" />}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) { updateDropdownPosition(); setShowDropdown(true); } }}
          placeholder="City, street or postcode…"
          autoComplete="off"
          className="flex-1 bg-transparent text-gray-700 outline-none placeholder:text-gray-400/50 text-sm w-full font-medium min-w-0"
        />
        <button
          onClick={handleGetQuote}
          className="bg-[#62D2A2] hover:bg-[#4bbd8b] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#62D2A2]/30 shrink-0 flex items-center gap-1"
        >
          Get Quote
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>

      {error && <p className="text-red-400 text-xs mt-1 pl-4">{error}</p>}

      {dropdown}
    </div>
  );
}
