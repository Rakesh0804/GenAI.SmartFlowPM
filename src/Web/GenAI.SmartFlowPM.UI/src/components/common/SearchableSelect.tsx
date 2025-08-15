'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X, Loader2 } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => Promise<Option[]>;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  error?: string;
  minSearchLength?: number;
  initialOptions?: Option[];
  showClearButton?: boolean;
}

export default function SearchableSelect({
  placeholder,
  value,
  onChange,
  onSearch,
  disabled = false,
  className = '',
  icon,
  error,
  minSearchLength = 1,
  initialOptions = [],
  showClearButton = true
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<Option[]>(Array.isArray(initialOptions) ? initialOptions : []);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find selected option from current options or initial options
  useEffect(() => {
    if (value) {
      const allOptions = [
        ...(Array.isArray(options) ? options : []), 
        ...(Array.isArray(initialOptions) ? initialOptions : [])
      ];
      const found = allOptions.find(opt => opt.id === value);
      setSelectedOption(found || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, options, initialOptions]);

  // Handle search
  useEffect(() => {
    const searchOptions = async () => {
      if (searchQuery.length >= minSearchLength) {
        try {
          setLoading(true);
          const results = await onSearch(searchQuery);
          setOptions(results);
        } catch (error) {
          console.error('Search error:', error);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setOptions(Array.isArray(initialOptions) ? initialOptions : []);
      }
    };

    const debounceTimer = setTimeout(searchOptions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch, minSearchLength, initialOptions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update dropdown position on scroll and resize
  useEffect(() => {
    if (!isOpen) return;

    const handlePositionUpdate = () => {
      calculateDropdownPosition();
    };

    window.addEventListener('scroll', handlePositionUpdate, true);
    window.addEventListener('resize', handlePositionUpdate);

    return () => {
      window.removeEventListener('scroll', handlePositionUpdate, true);
      window.removeEventListener('resize', handlePositionUpdate);
    };
  }, [isOpen]);

  const handleSelect = (option: Option) => {
    onChange(option.id);
    setSelectedOption(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onChange('');
    setSelectedOption(null);
    setSearchQuery('');
    setIsOpen(false);
  };

  const calculateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const handleInputFocus = () => {
    calculateDropdownPosition();
    setIsOpen(true);
    if (!searchQuery && options.length === 0) {
      setOptions(Array.isArray(initialOptions) ? initialOptions : []);
    }
  };

  const handleToggleDropdown = () => {
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className={`relative ${className}`}>
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchQuery : (selectedOption?.label || '')}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full pr-10 py-2 border border-gray-300 rounded-md 
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
            disabled:bg-gray-50 disabled:text-gray-500 
            transition-all duration-200
            ${icon ? 'pl-11' : 'pl-4'}
            ${error ? 'border-red-300' : ''}
          `}
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
          
          {showClearButton && selectedOption && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          <button
            type="button"
            onClick={handleToggleDropdown}
            disabled={disabled}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div 
          className="absolute z-[9999] bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            minWidth: dropdownPosition.width
          }}
        >
          {/* Search input when dropdown is open */}
          {isOpen && searchQuery.length < minSearchLength && (
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <Search className="w-4 h-4 mr-2" />
                Type {minSearchLength} or more characters to search...
              </div>
            </div>
          )}

          {/* Options list */}
          {options.length > 0 ? (
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors
                    ${selectedOption?.id === option.id ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}
                  `}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    {option.sublabel && (
                      <span className="text-sm text-gray-500">{option.sublabel}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.length >= minSearchLength && !loading ? (
            <div className="p-4 text-center text-gray-500">
              No results found for "{searchQuery}"
            </div>
          ) : null}
        </div>,
        document.body
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
