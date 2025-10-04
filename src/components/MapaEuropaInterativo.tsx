'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  MapPin, 
  Camera, 
  Plane, 
  Train, 
  Car,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2
} from 'lucide-react'

interface Photo {
  id: string
  title: string
  description: string | null
  city: string
  country: string
  imageData: string
  imageType: string
  takenAt: string
  createdAt: string
}

interface TravelRoute {
  id: string
  city: string
  country: string
  transport: string
  order: number
  visited: boolean
  visitedAt: string | null
  latitude?: number
  longitude?: number
}

interface MapaEuropaInterativoProps {
  routes: TravelRoute[]
  photos: Photo[]
  isAuthenticated: boolean
  onPhotoUpload: (file: File, city: string) => void
}

// Coordenadas mais precisas das cidades na Europa
const cityCoordinates: Record<string, { x: number; y: number; country: string }> = {
  'Brasil': { x: 15, y: 85, country: 'Brasil' },
  'Reino Unido': { x: 42, y: 25, country: 'Reino Unido' },
  'Escócia': { x: 40, y: 20, country: 'Reino Unido' },
  'Londres': { x: 44, y: 30, country: 'Reino Unido' },
  'Paris': { x: 48, y: 35, country: 'França' },
  'Milão': { x: 55, y: 42, country: 'Itália' },
  'Lugano': { x: 54, y: 45, country: 'Suíça' },
  'Zurique': { x: 52, y: 42, country: 'Suíça' },
  'Luxemburgo': { x: 48, y: 35, country: 'Luxemburgo' },
  'Bruxelas': { x: 46, y: 32, country: 'Bélgica' },
  'Amsterdã': { x: 47, y: 28, country: 'Holanda' },
  'Sønderborg': { x: 50, y: 25, country: 'Dinamarca' },
  'Hamburgo': { x: 50, y: 28, country: 'Alemanha' },
  'Berlim': { x: 52, y: 30, country: 'Alemanha' },
  'Zary': { x: 55, y: 32, country: 'Polônia' },
  'Praga': { x: 52, y: 35, country: 'República Tcheca' },
  'Viena': { x: 54, y: 40, country: 'Áustria' },
  'Bratislava': { x: 56, y: 38, country: 'Eslováquia' },
  'Szombathely': { x: 56, y: 40, country: 'Hungria' },
  'Zagreb': { x: 54, y: 42, country: 'Croácia' },
  'Liubliana': { x: 52, y: 42, country: 'Eslovênia' },
  'Veneza': { x: 54, y: 45, country: 'Itália' },
  'Ravena': { x: 55, y: 45, country: 'Itália' },
  'Roma': { x: 54, y: 50, country: 'Itália' },
  'Montepulciano': { x: 54, y: 48, country: 'Itália' },
  'Pisa': { x: 52, y: 48, country: 'Itália' },
  'Florença': { x: 53, y: 47, country: 'Itália' },
  'Monaco': { x: 51, y: 50, country: 'Mônaco' },
  'Turim': { x: 51, y: 42, country: 'Itália' }
}

const transportIcons = {
  plane: Plane,
  train: Train,
  car: Car
}

const transportColors = {
  plane: 'text-blue-500',
  train: 'text-green-500',
  car: 'text-purple-500'
}

export default function MapaEuropaInterativo({ routes, photos, isAuthenticated, onPhotoUpload }: MapaEuropaInterativoProps) {
  const [selectedCity, setSelectedCity] = useState<TravelRoute | null>(null)
  const [cityPhotos, setCityPhotos] = useState<Photo[]>([])
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const mapRef = useRef<HTMLDivElement>(null)

  const getCityPhotos = (city: string) => {
    return photos.filter(photo => photo.city.toLowerCase() === city.toLowerCase())
  }

  const handleCityClick = (route: TravelRoute) => {
    setSelectedCity(route)
    setCityPhotos(getCityPhotos(route.city))
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && selectedCity) {
      setUploadFile(file)
      onPhotoUpload(file, selectedCity.city)
      setShowPhotoUpload(false)
      setUploadFile(null)
      setTimeout(() => {
        setCityPhotos(getCityPhotos(selectedCity.city))
      }, 1000)
    }
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Agrupar cidades por país para mostrar a ordem
  const routesByCountry = routes.reduce((acc, route) => {
    const country = cityCoordinates[route.city]?.country || route.country
    if (!acc[country]) {
      acc[country] = []
    }
    acc[country].push(route)
    return acc
  }, {} as Record<string, TravelRoute[]>)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Mapa Interativo da Europa</h3>
            <p className="text-gray-600">Clique nos pontos para ver fotos de cada local</p>
          </div>
          
          {/* Controles de zoom */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Diminuir zoom"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Aumentar zoom"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Resetar zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gray-50">
        {/* Mapa interativo */}
        <div
          ref={mapRef}
          className="relative cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Mapa de fundo mais realista */}
          <div className="relative bg-gradient-to-br from-blue-50 to-green-50 p-8 min-h-[600px]">
            <svg
              width="100%"
              height="600"
              viewBox="0 0 800 600"
              className="absolute inset-0"
            >
              {/* Contorno da Europa mais detalhado */}
              <path
                d="M50 150 L100 120 L150 110 L200 100 L250 90 L300 85 L350 80 L400 75 L450 80 L500 75 L550 80 L600 75 L650 80 L700 75 L750 80 L750 120 L700 130 L650 125 L600 135 L550 130 L500 140 L450 135 L400 145 L350 140 L300 150 L250 145 L200 155 L150 150 L100 160 L50 170 L50 150 Z"
                fill="#e0f2fe"
                stroke="#0ea5e9"
                strokeWidth="2"
              />
              
              {/* Países principais */}
              <path
                d="M100 150 L200 140 L300 135 L400 130 L500 125 L600 120 L700 115 L700 180 L600 185 L500 190 L400 195 L300 200 L200 205 L100 210 L100 150 Z"
                fill="#bae6fd"
                stroke="#0ea5e9"
                strokeWidth="1"
              />
              
              {/* Mar Mediterrâneo */}
              <path
                d="M200 300 L400 320 L600 310 L700 300 L700 350 L600 340 L400 350 L200 360 L200 300 Z"
                fill="#7dd3fc"
                stroke="#0ea5e9"
                strokeWidth="1"
              />
              
              {/* Mar do Norte */}
              <path
                d="M300 50 L500 60 L600 55 L650 60 L650 100 L600 95 L500 100 L300 90 L300 50 Z"
                fill="#7dd3fc"
                stroke="#0ea5e9"
                strokeWidth="1"
              />
            </svg>
            
            {/* Pontos das cidades */}
            {routes.map((route) => {
              const coords = cityCoordinates[route.city]
              if (!coords) return null
              
              const Icon = transportIcons[route.transport as keyof typeof transportIcons]
              const colorClass = transportColors[route.transport as keyof typeof transportColors]
              const cityPhotosCount = getCityPhotos(route.city).length
              
              return (
                <motion.button
                  key={route.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${
                    selectedCity?.id === route.id ? 'z-20' : 'z-10'
                  }`}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`
                  }}
                  onClick={() => handleCityClick(route)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`w-6 h-6 rounded-full border-3 border-white shadow-lg flex items-center justify-center ${
                    route.visited ? 'bg-green-500' : 'bg-gray-400'
                  } ${selectedCity?.id === route.id ? 'ring-4 ring-blue-300' : ''}`}>
                    <Icon className={`h-3 w-3 ${
                      selectedCity?.id === route.id ? 'text-white' : colorClass
                    }`} />
                  </div>
                  
                  {/* Badge com número de fotos */}
                  {cityPhotosCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cityPhotosCount}
                    </div>
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                    <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                      <div className="font-semibold">{route.city}</div>
                      <div className="text-xs opacity-80">{coords.country}</div>
                      {cityPhotosCount > 0 && (
                        <div className="text-xs text-blue-300">{cityPhotosCount} fotos</div>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Painel lateral com detalhes da cidade */}
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-0 right-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-40"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-gray-800">{selectedCity.city}</h4>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600">{cityCoordinates[selectedCity.city]?.country || selectedCity.country}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {React.createElement(transportIcons[selectedCity.transport as keyof typeof transportIcons], {
                    className: `h-4 w-4 ${transportColors[selectedCity.transport as keyof typeof transportColors]}`
                  })}
                  <span className="text-sm text-gray-500 capitalize">{selectedCity.transport}</span>
                </div>
                {selectedCity.visited && selectedCity.visitedAt && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ Visitado em {new Date(selectedCity.visitedAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>

              {/* Fotos da cidade */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-gray-800">Fotos ({cityPhotos.length})</h5>
                  {isAuthenticated && (
                    <button
                      onClick={() => setShowPhotoUpload(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Adicionar</span>
                    </button>
                  )}
                </div>

                {cityPhotos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhuma foto ainda</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {cityPhotos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <Image
                          src={photo.imageData}
                          alt={photo.title}
                          width={150}
                          height={150}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <p className="text-white text-xs text-center px-2">{photo.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Modal de upload de foto */}
        {showPhotoUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Adicionar Foto - {selectedCity?.city}</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setShowPhotoUpload(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legenda da ordem dos países */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">Ordem da Viagem por País:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(routesByCountry).map(([country, countryRoutes]) => (
            <div key={country} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-700">{country}</span>
              <span className="text-xs text-gray-500">({countryRoutes.length} cidades)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}