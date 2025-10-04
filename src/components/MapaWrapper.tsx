'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Importar o componente do mapa apenas no cliente
const MapaReal = dynamic(() => import('./MapaReal'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Mapa Interativo da Europa</h3>
        <p className="text-gray-600">Carregando mapa...</p>
      </div>
      <div className="h-96 w-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mapa interativo...</p>
        </div>
      </div>
    </div>
  )
})

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

interface MapaWrapperProps {
  routes: TravelRoute[]
  photos: Photo[]
  isAuthenticated: boolean
  onPhotoUpload: (file: File, city: string) => void
  onImageClick?: (photo: Photo) => void
  onOpenUploadModal?: (city: string, country: string) => void
  onAddCity?: () => void
}

export default function MapaWrapper(props: MapaWrapperProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Mapa Interativo da Europa</h3>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
        <div className="h-96 w-full bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando mapa interativo...</p>
          </div>
        </div>
      </div>
    )
  }

  return <MapaReal {...props} />
}