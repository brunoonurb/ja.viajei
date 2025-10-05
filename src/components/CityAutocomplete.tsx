'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import { searchCities, City } from '@/lib/cities'

interface CityAutocompleteProps {
  value: string
  onChange: (value: string) => void
  country?: string
  placeholder?: string
  className?: string
  required?: boolean
}

export default function CityAutocomplete({
  value,
  onChange,
  country,
  placeholder = "Nome da cidade",
  className = "",
  required = false
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<City[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Buscar sugestões quando o valor ou país muda
  useEffect(() => {
    const results = searchCities(value, country)
    setSuggestions(results)
    setHighlightedIndex(-1)
  }, [value, country])

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsOpen(true)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleSuggestionClick = (city: City) => {
    onChange(city.name)
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${className}`}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown de sugestões */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((city, index) => (
            <div
              key={`${city.countryCode}-${city.name}-${index}`}
              className={`flex items-center px-3 py-2 cursor-pointer transition-colors ${
                index === highlightedIndex
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
              onClick={() => handleSuggestionClick(city)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{city.name}</div>
                {city.nameEn !== city.name && (
                  <div className="text-sm text-gray-500">{city.nameEn}</div>
                )}
                <div className="text-xs text-gray-400">{city.country}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensagem quando não há sugestões */}
      {isOpen && suggestions.length === 0 && value && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          <div className="px-3 py-2 text-gray-500 text-center">
            {country 
              ? `Nenhuma cidade encontrada para "${value}" em ${country}`
              : `Nenhuma cidade encontrada para "${value}"`
            }
          </div>
        </div>
      )}

      {/* Mensagem para selecionar país primeiro */}
      {isOpen && !country && !value && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          <div className="px-3 py-2 text-gray-500 text-center">
            Digite o nome da cidade ou selecione um país primeiro
          </div>
        </div>
      )}
    </div>
  )
}