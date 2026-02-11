"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "PT", name: "Portugal" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "IE", name: "Ireland" },
  { code: "NZ", name: "New Zealand" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" },
  { code: "BH", name: "Bahrain" },
  { code: "OM", name: "Oman" },
  { code: "CN", name: "China" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "ID", name: "Indonesia" },
  { code: "VN", name: "Vietnam" },
  { code: "PH", name: "Philippines" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "MA", name: "Morocco" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
].sort((a, b) => a.name.localeCompare(b.name));

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CountrySelectWithSearch({
  value,
  onChange,
  placeholder = "Select a country",
  className,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((country) =>
      country.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const selectedCountryName = useMemo(() => {
    return COUNTRIES.find((country) => country.code === value)?.name;
  }, [value]);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="w-full justify-between font-normal bg-white border-gray-300 hover:bg-gray-50 text-left"
      >
        {selectedCountryName || <span className="text-gray-500">{placeholder}</span>}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      
      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
           <div className="sticky top-0 z-10 bg-white px-3 py-2 border-b border-gray-100 flex items-center">
             <Search className="w-4 h-4 text-gray-400 mr-2" />
             <input
                type="text"
                className="w-full border-none p-0 text-sm focus:ring-0 text-gray-900 placeholder-gray-400"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
             />
           </div>
           
           {filteredCountries.length === 0 ? (
             <div className="py-6 text-center text-sm text-gray-500">No country found.</div>
           ) : (
             <ul className="py-1">
               {filteredCountries.map((country) => (
                 <li
                   key={country.code}
                   className={cn(
                     "relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-teal-50 hover:text-teal-900 cursor-pointer flex items-center",
                     value === country.code ? "bg-teal-50 text-teal-900 font-medium" : "text-gray-900"
                   )}
                   onClick={() => {
                     onChange(country.code);
                     setOpen(false);
                     setSearch("");
                   }}
                 >
                    <span className="block truncate">{country.name}</span>
                    {value === country.code && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-teal-600">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                 </li>
               ))}
             </ul>
           )}
        </div>
      )}
    </div>
  );
}
