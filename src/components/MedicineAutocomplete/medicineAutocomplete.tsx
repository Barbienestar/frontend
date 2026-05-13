import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchMedicines } from '@/services/stockService';
import type { MedicineSearchResult } from '@/common/MedicineSearchResult';

interface MedicineAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (label: string) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const MedicineAutocomplete = ({
  value,
  onChange,
  onSelect,
  onSearch,
  isLoading = false,
}: MedicineAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<MedicineSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchMedicines(value.trim());
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buildLabel = (item: MedicineSearchResult) =>
    [item.generic_name, item.dosage_form, item.strength]
      .filter(Boolean)
      .join(' ');

  const handleSelect = (item: MedicineSearchResult) => {
    const label = buildLabel(item);
    onChange(label);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelect(label);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      onSearch(value.trim());
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder="Metformina 850mg"
        disabled={isLoading}
        className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />

      {showSuggestions && (
        <ul className="absolute top-full left-0 right-0 z-9999 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {' '}
          {suggestions.map((item) => (
            <li
              key={item.id}
              onMouseDown={() => handleSelect(item)}
              className="px-4 py-2.5 text-sm cursor-pointer hover:bg-muted transition-colors flex flex-col"
            >
              <span className="font-medium text-foreground capitalize">
                {item.generic_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {[item.dosage_form, item.strength].filter(Boolean).join(' · ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicineAutocomplete;
