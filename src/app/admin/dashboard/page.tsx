'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Camera, 
  MapPin, 
  Users, 
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  ArrowLeft,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { compressPhotoForTravel } from '@/lib/imageCompression'

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
}

export default function AdminDashboard() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [routes, setRoutes] = useState<TravelRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null)
  const [editData, setEditData] = useState({ title: '', description: '', city: '', country: '' })
  const [showAddPhoto, setShowAddPhoto] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [photosRes, routesRes] = await Promise.all([
        fetch('/api/photos'),
        fetch('/api/routes')
      ])
      
      const photosData = await photosRes.json()
      const routesData = await routesRes.json()
      
      setPhotos(photosData)
      setRoutes(routesData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Comprime a imagem antes do upload
      const compressedBase64 = await compressPhotoForTravel(file)
      const originalSize = (file.size / 1024).toFixed(1)
      const compressedSize = (compressedBase64.length * 0.75 / 1024).toFixed(1)
      
      console.log(`📸 Upload Admin: ${file.name}`)
      console.log(`📏 Tamanho original: ${originalSize}KB`)
      console.log(`🗜️ Tamanho comprimido: ${compressedSize}KB`)
      console.log(`💾 Redução: ${((1 - (parseFloat(compressedSize) / parseFloat(originalSize))) * 100).toFixed(1)}%`)

      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: file.name.split('.')[0],
          description: '',
          city: '',
          country: '',
          imageData: compressedBase64,
          imageType: file.type
        })
      })

      if (response.ok) {
        const newPhoto = await response.json()
        setPhotos([newPhoto, ...photos])
        setShowAddPhoto(false)
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      
      // Fallback: usa o método original se a compressão falhar
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string
        const imageType = file.type

        try {
          const response = await fetch('/api/photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: file.name.split('.')[0],
              description: '',
              city: '',
              country: '',
              imageData: base64,
              imageType
            })
          })

          if (response.ok) {
            const newPhoto = await response.json()
            setPhotos([newPhoto, ...photos])
            setShowAddPhoto(false)
          }
        } catch (fallbackError) {
          console.error('Erro no fallback:', fallbackError)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo.id)
    setEditData({
      title: photo.title,
      description: photo.description || '',
      city: photo.city,
      country: photo.country
    })
  }

  const handleSaveEdit = async () => {
    if (!editingPhoto) return

    try {
      const response = await fetch(`/api/photos/${editingPhoto}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      if (response.ok) {
        const updatedPhoto = await response.json()
        setPhotos(photos.map(p => p.id === editingPhoto ? updatedPhoto : p))
        setEditingPhoto(null)
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
    }
  }

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta foto?')) return

    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPhotos(photos.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  const toggleRouteVisited = async (routeId: string, visited: boolean) => {
    try {
      const response = await fetch(`/api/routes/${routeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          visited,
          visitedAt: visited ? new Date().toISOString() : null
        })
      })

      if (response.ok) {
        const updatedRoute = await response.json()
        setRoutes(routes.map(r => r.id === routeId ? updatedRoute : r))
      }
    } catch (error) {
      console.error('Erro ao atualizar rota:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  const visitedRoutes = routes.filter(r => r.visited).length
  const totalRoutes = routes.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/viagem" className="btn-secondary">
                Ver Site
              </Link>
              <button className="text-gray-600 hover:text-gray-800">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Camera className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Fotos</p>
                <p className="text-2xl font-bold text-gray-900">{photos.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cidades Visitadas</p>
                <p className="text-2xl font-bold text-gray-900">{visitedRoutes}/{totalRoutes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progresso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((visitedRoutes / totalRoutes) * 100)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-pink-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aventureiros</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gerenciar Fotos */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Gerenciar Fotos</h2>
                <button
                  onClick={() => setShowAddPhoto(!showAddPhoto)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Foto</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {showAddPhoto && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload de Foto
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {photos.map((photo) => (
                  <div key={photo.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="relative w-16 h-16">
                      <Image
                        src={photo.imageData}
                        alt={photo.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{photo.title}</p>
                      <p className="text-sm text-gray-500">{photo.city}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(photo.takenAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPhoto(photo)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gerenciar Rotas */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Gerenciar Rotas</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {routes.map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${route.visited ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{route.city}</p>
                        <p className="text-xs text-gray-500">{route.country}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleRouteVisited(route.id, !route.visited)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        route.visited
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {route.visited ? 'Visitado' : 'Não visitado'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Edição */}
        {editingPhoto && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Editar Foto</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={editData.city}
                    onChange={(e) => setEditData({...editData, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    value={editData.country}
                    onChange={(e) => setEditData({...editData, country: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Salvar</span>
                </button>
                <button
                  onClick={() => setEditingPhoto(null)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}