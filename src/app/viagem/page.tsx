'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Camera, 
  Plane, 
  Train, 
  Car,
  Heart,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Lock,
  LogIn,
  Calendar,
  Pencil,
  Trash,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import MapaWrapper from '@/components/MapaWrapper'
import CountryAutocomplete from '@/components/CountryAutocomplete'
import CityAutocomplete from '@/components/CityAutocomplete'
import SocialMedia from '@/components/SocialMedia'
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

export default function ViagemPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [routes, setRoutes] = useState<TravelRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null)
  const [editData, setEditData] = useState({ title: '', description: '', city: '', country: '', takenAt: '' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null)
  const [imageViewerIndex, setImageViewerIndex] = useState(0)
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]) // State for filtered photos in viewer
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadData, setUploadData] = useState({ title: '', description: '', city: '', country: '', takenAt: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showAddCityModal, setShowAddCityModal] = useState(false)
  const [newCityData, setNewCityData] = useState({ 
    city: '', 
    country: '', 
    transport: 'car' as 'plane' | 'train' | 'car', 
    order: 0,
    address: '' // Novo campo para endereço completo
  })
  const [showEditCityModal, setShowEditCityModal] = useState(false)
  const [editingCity, setEditingCity] = useState<TravelRoute | null>(null)
  const [editCityData, setEditCityData] = useState({ 
    city: '', 
    country: '', 
    transport: 'car' as 'plane' | 'train' | 'car', 
    order: 0,
    address: '',
    visited: false
  })
  const [isCitiesSectionOpen, setIsCitiesSectionOpen] = useState(false)

  // Carregar dados
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Verificação simples de credenciais
      if (loginData.email === 'admin@viagem.com' && loginData.password === 'viagem2024') {
        setIsAuthenticated(true)
        setShowLogin(false)
        setLoginData({ email: '', password: '' })
        
        // Salvar no localStorage para persistir a sessão
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userEmail', loginData.email)
      } else {
        alert('Credenciais inválidas')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      alert('Erro ao fazer login')
    }
  }

  // Verificar se já está autenticado ao carregar a página
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated')
    if (isAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
  }

  const openUploadModal = () => {
    setShowUploadModal(true)
    setUploadData({ title: '', description: '', city: '', country: '', takenAt: new Date().toISOString().split('T')[0] })
    setSelectedFile(null)
  }

  const closeUploadModal = () => {
    setShowUploadModal(false)
    setUploadData({ title: '', description: '', city: '', country: '', takenAt: '' })
    setSelectedFile(null)
  }

  const openAddCityModal = () => {
    setShowAddCityModal(true)
    setNewCityData({ 
      city: '', 
      country: '', 
      transport: 'car', 
      order: Array.isArray(routes) ? routes.length + 1 : 1,
      address: ''
    })
  }

  const closeAddCityModal = () => {
    setShowAddCityModal(false)
    setNewCityData({ city: '', country: '', transport: 'car', order: 0, address: '' })
  }

  const handleAddCity = async () => {
    if (!newCityData.city || !newCityData.country) {
      alert('Por favor, preencha cidade e país')
      return
    }

    try {
      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: newCityData.city,
          country: newCityData.country,
          transport: newCityData.transport,
          order: newCityData.order,
          visited: false,
          address: newCityData.address // Incluir endereço completo
        })
      })

      if (response.ok) {
        const newRoute = await response.json()
        setRoutes([...routes, newRoute])
        closeAddCityModal()
        alert('Cidade adicionada com sucesso!')
      } else {
        const errorData = await response.json()
        alert(`Erro ao adicionar cidade: ${errorData.details || errorData.error}`)
      }
    } catch (error) {
      console.error('Erro ao adicionar cidade:', error)
      alert('Erro ao adicionar cidade')
    }
  }

  const openEditCityModal = (city: TravelRoute) => {
    setEditingCity(city)
    setEditCityData({
      city: city.city,
      country: city.country,
      transport: city.transport as 'plane' | 'train' | 'car',
      order: city.order,
      address: '',
      visited: city.visited
    })
    setShowEditCityModal(true)
  }

  const closeEditCityModal = () => {
    setShowEditCityModal(false)
    setEditingCity(null)
    setEditCityData({ city: '', country: '', transport: 'car', order: 0, address: '', visited: false })
  }

  const handleEditCity = async () => {
    if (!editingCity || !editCityData.city || !editCityData.country) {
      alert('Por favor, preencha cidade e país')
      return
    }

    try {
      const response = await fetch(`/api/routes/${editingCity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: editCityData.city,
          country: editCityData.country,
          transport: editCityData.transport,
          order: editCityData.order,
          visited: editCityData.visited,
          address: editCityData.address
        })
      })

      if (response.ok) {
        const updatedRoute = await response.json()
        setRoutes(routes.map(route => route.id === editingCity.id ? updatedRoute : route))
        closeEditCityModal()
        alert('Cidade editada com sucesso!')
      } else {
        const errorData = await response.json()
        alert(`Erro ao editar cidade: ${errorData.details || errorData.error}`)
      }
    } catch (error) {
      console.error('Erro ao editar cidade:', error)
      alert('Erro ao editar cidade')
    }
  }

  const handleDeleteCity = async (city: TravelRoute) => {
    if (!confirm(`Tem certeza que deseja deletar ${city.city}, ${city.country}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/routes/${city.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setRoutes(routes.filter(route => route.id !== city.id))
        alert('Cidade deletada com sucesso!')
      } else {
        const errorData = await response.json()
        alert(`Erro ao deletar cidade: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Erro ao deletar cidade:', error)
      alert('Erro ao deletar cidade')
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!uploadData.title) {
        setUploadData(prev => ({ ...prev, title: file.name.split('.')[0] }))
      }
    }
  }

  const handleUploadWithData = async () => {
    if (!selectedFile) return

    try {
      // Comprime a imagem antes do upload
      const compressedBase64 = await compressPhotoForTravel(selectedFile)
      const originalSize = (selectedFile.size / 1024).toFixed(1)
      const compressedSize = (compressedBase64.length * 0.75 / 1024).toFixed(1)
      
      console.log(`📸 Upload: ${selectedFile.name}`)
      console.log(`📏 Tamanho original: ${originalSize}KB`)
      console.log(`🗜️ Tamanho comprimido: ${compressedSize}KB`)
      console.log(`💾 Redução: ${((1 - (parseFloat(compressedSize) / parseFloat(originalSize))) * 100).toFixed(1)}%`)

      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadData.title,
          description: uploadData.description,
          city: uploadData.city,
          country: uploadData.country,
          imageData: compressedBase64,
          imageType: selectedFile.type,
          takenAt: new Date(uploadData.takenAt).toISOString()
        })
      })

      if (response.ok) {
        const newPhoto = await response.json()
        setPhotos([newPhoto, ...photos])
        closeUploadModal()
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      
      // Fallback: usa o método original se a compressão falhar
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string
        const imageType = selectedFile.type

        try {
          const response = await fetch('/api/photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: uploadData.title,
              description: uploadData.description,
              city: uploadData.city,
              country: uploadData.country,
              imageData: base64,
              imageType,
              takenAt: new Date(uploadData.takenAt).toISOString()
            })
          })

          if (response.ok) {
            const newPhoto = await response.json()
            setPhotos([newPhoto, ...photos])
            closeUploadModal()
          }
        } catch (fallbackError) {
          console.error('Erro no fallback:', fallbackError)
        }
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleImageClick = (photo: Photo, photosArray?: Photo[]) => {
    const photosToUse = photosArray || photos
    setFilteredPhotos(photosToUse)
    setSelectedImage(photo)
    const index = photosToUse.findIndex(p => p.id === photo.id)
    setImageViewerIndex(index)
  }

  const handleNextImage = () => {
    const photosToUse = filteredPhotos.length > 0 ? filteredPhotos : photos
    const nextIndex = (imageViewerIndex + 1) % photosToUse.length
    setImageViewerIndex(nextIndex)
    setSelectedImage(photosToUse[nextIndex])
  }

  const handlePrevImage = () => {
    const photosToUse = filteredPhotos.length > 0 ? filteredPhotos : photos
    const prevIndex = imageViewerIndex === 0 ? photosToUse.length - 1 : imageViewerIndex - 1
    setImageViewerIndex(prevIndex)
    setSelectedImage(photosToUse[prevIndex])
  }

  const closeImageViewer = () => {
    setSelectedImage(null)
    setImageViewerIndex(0)
  }

  // Suporte a teclado para navegação
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImage) {
        switch (event.key) {
          case 'Escape':
            closeImageViewer()
            break
          case 'ArrowLeft':
            handlePrevImage()
            break
          case 'ArrowRight':
            handleNextImage()
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, imageViewerIndex, photos])


  const handlePhotoUploadByCity = async (file: File, city: string) => {
    try {
      // Comprime a imagem antes do upload
      const compressedBase64 = await compressPhotoForTravel(file)
      const originalSize = (file.size / 1024).toFixed(1)
      const compressedSize = (compressedBase64.length * 0.75 / 1024).toFixed(1)
      
      console.log(`📸 Upload: ${file.name}`)
      console.log(`📏 Tamanho original: ${originalSize}KB`)
      console.log(`🗜️ Tamanho comprimido: ${compressedSize}KB`)
      console.log(`💾 Redução: ${((1 - (parseFloat(compressedSize) / parseFloat(originalSize))) * 100).toFixed(1)}%`)

      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: file.name.split('.')[0],
          description: `Foto de ${city}`,
          city: city,
          country: Array.isArray(routes) ? routes.find(r => r.city === city)?.country || '' : '',
          imageData: compressedBase64,
          imageType: file.type
        })
      })

      if (response.ok) {
        const newPhoto = await response.json()
        setPhotos([newPhoto, ...photos])
        // Entrar automaticamente no modo de edição
        setEditingPhoto(newPhoto.id)
        setEditData({
          title: newPhoto.title,
          description: newPhoto.description || '',
          city: newPhoto.city,
          country: newPhoto.country,
          takenAt: newPhoto.takenAt ? new Date(newPhoto.takenAt).toISOString().split('T')[0] : ''
        })
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
              description: `Foto de ${city}`,
              city: city,
              country: Array.isArray(routes) ? routes.find(r => r.city === city)?.country || '' : '',
              imageData: base64,
              imageType
            })
          })

          if (response.ok) {
            const newPhoto = await response.json()
            setPhotos([newPhoto, ...photos])
            setEditingPhoto(newPhoto.id)
            setEditData({
              title: newPhoto.title,
              description: newPhoto.description || '',
              city: newPhoto.city,
              country: newPhoto.country,
              takenAt: newPhoto.takenAt ? new Date(newPhoto.takenAt).toISOString().split('T')[0] : ''
            })
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
      country: photo.country,
      takenAt: photo.takenAt ? new Date(photo.takenAt).toISOString().split('T')[0] : ''
    })
  }

  const handleSaveEdit = async () => {
    if (editingPhoto) {
      await handleSavePhoto(editingPhoto)
    }
  }

  const handleSavePhoto = async (id: string) => {
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      if (response.ok) {
        const updatedPhoto = await response.json()
        setPhotos(Array.isArray(photos) ? photos.map(p => p.id === id ? updatedPhoto : p) : [])
        setEditingPhoto(null)
      }
    } catch (error) {
      console.error('Erro ao salvar foto:', error)
    }
  }


  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta foto?')) return

    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPhotos(Array.isArray(photos) ? photos.filter(p => p.id !== id) : [])
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando nossa aventura...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/javiajei_watermark_800.png"
                alt="Já Viajei"
                width={32}
                height={32}
                className="rounded-lg"
              />
             <div className="hidden sm:block">
                <h1 className="text-xl font-bold gradient-text">
                  Já Viajei
                </h1>
                <p className="text-sm text-gray-600">Nossa Aventura Europeia</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              {/* Redes Sociais */}
              <div>
                <SocialMedia size="sm" variant="compact" />
              </div>
              
              <Link href="/" className="btn-secondary">
                Voltar
              </Link>
              {!isAuthenticated ? (
                <button
                  onClick={() => setShowLogin(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
              Nossa Jornada
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Acompanhe nossa aventura pela Europa! Dois casais e o pequeno Theo (5 meses) 
              explorando o continente através das fotos e memórias que vamos compartilhando!
            </p>
          
            {/* Upload de Fotos */}
            {isAuthenticated && (
              <button
                onClick={openUploadModal}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Camera className="h-5 w-5" />
                <span>Adicionar Foto</span>
              </button>
            )}
        </motion.section>

        {/* Mapa Real */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <MapaWrapper
            routes={routes}
            photos={photos}
            isAuthenticated={isAuthenticated}
            onPhotoUpload={handlePhotoUploadByCity}
            onImageClick={handleImageClick}
            onOpenUploadModal={(city, country) => {
              setUploadData(prev => ({ ...prev, city, country }))
              setShowUploadModal(true)
            }}
            onAddCity={openAddCityModal}
          />
        </motion.section>

        {/* Lista de Cidades - Apenas para usuários autenticados */}
        {isAuthenticated && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div 
                className="flex justify-between items-center mb-6 cursor-pointer"
                onClick={() => setIsCitiesSectionOpen(!isCitiesSectionOpen)}
              >
                <div className="flex items-center space-x-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Cidades da Viagem
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {Array.isArray(routes) ? routes.length : 0} cidades
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  {isCitiesSectionOpen && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openAddCityModal()
                      }}
                      className="btn-primary inline-flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Adicionar</span>
                    </button>
                  )}
                  <div className="text-gray-400">
                    {isCitiesSectionOpen ? (
                      <ChevronDown className="h-6 w-6" />
                    ) : (
                      <ChevronRight className="h-6 w-6" />
                    )}
                  </div>
                </div>
              </div>

              {/* Conteúdo da lista com animação de collapse */}
              <motion.div
                initial={false}
                animate={{
                  height: isCitiesSectionOpen ? 'auto' : 0,
                  opacity: isCitiesSectionOpen ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  {Array.isArray(routes) && routes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {routes
                  .sort((a, b) => a.order - b.order)
                  .map((route) => (
                    <div
                      key={route.id}
                      className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
                        route.visited 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{route.city}</h4>
                          <p className="text-sm text-gray-600">{route.country}</p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => openEditCityModal(route)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Editar cidade"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCity(route)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Deletar cidade"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          {route.transport === 'plane' && <Plane className="h-4 w-4 text-blue-600" />}
                          {route.transport === 'train' && <Train className="h-4 w-4 text-green-600" />}
                          {route.transport === 'car' && <Car className="h-4 w-4 text-purple-600" />}
                          <span className="capitalize text-gray-600">
                            {route.transport === 'plane' ? 'Avião' : 
                             route.transport === 'train' ? 'Trem' : 'Carro'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">#{route.order}</span>
                          {route.visited && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Visitada
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma cidade adicionada</h4>
                <p className="text-gray-500 mb-4">Comece adicionando cidades ao seu roteiro</p>
                <button
                  onClick={openAddCityModal}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Primeira Cidade</span>
                </button>
                  </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Galeria de Fotos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">
              Memórias da Viagem
            </h3>

          {!Array.isArray(photos) || photos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma foto adicionada ainda</p>
              <p className="text-gray-400">As fotos aparecerão aqui conforme a viagem for acontecendo!</p>
            </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative h-40">
                    <Image
                      src={photo.imageData}
                      alt={photo.title}
                      fill
                      className="object-cover cursor-pointer"
                      onClick={() => handleImageClick(photo)}
                    />
                    {isAuthenticated && (
                      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            handleEditPhoto(photo)
                          }}
                          className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            handleDeletePhoto(photo.id)
                          }}
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {editingPhoto === photo.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => setEditData({...editData, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Título"
                          />
                          <div className="relative">
                            <input
                              type="text"
                              value={editData.city}
                              onChange={(e) => setEditData({...editData, city: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Cidade"
                              list="city-suggestions"
                            />
                            <datalist id="city-suggestions">
                              {Array.isArray(routes) ? Array.from(new Set(routes.map(route => route.city))).map(city => (
                                <option key={city} value={city} />
                              )) : null}
                            </datalist>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={editData.country}
                              onChange={(e) => setEditData({...editData, country: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="País"
                              list="country-suggestions"
                            />
                            <datalist id="country-suggestions">
                              {Array.isArray(routes) ? Array.from(new Set(routes.map(route => route.country))).map(country => (
                                <option key={country} value={country} />
                              )) : null}
                            </datalist>
                          </div>
                          <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({...editData, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Descrição da foto"
                            rows={3}
                          />
                          <input
                            type="date"
                            value={editData.takenAt}
                            onChange={(e) => setEditData({...editData, takenAt: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Data da foto"
                          />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
                          >
                            <Save className="h-4 w-4" />
                            <span>Salvar</span>
                          </button>
                          <button
                            onClick={() => setEditingPhoto(null)}
                            className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-1"
                          >
                            <X className="h-4 w-4" />
                            <span>Cancelar</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">{photo.country}</h4>
                        {photo.city && (
                          <p className="text-blue-600 text-sm mb-1">{photo.city}</p>
                        )}
                        {photo.description && (
                          <p className="text-gray-600 text-sm mb-2">{photo.description}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(photo.takenAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>

      {/* Visualizador de Imagem Ampliada */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-2xl w-full mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Botão Fechar */}
            <button
              onClick={closeImageViewer}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            {/* Botão Anterior */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Botão Próximo */}
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Imagem */}
            <div className="relative">
              <Image
                src={selectedImage.imageData}
                alt={selectedImage.title}
                width={800}
                height={600}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* Informações da Imagem - Modal Suave */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white"
            >
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{selectedImage.country}</h3>
                <p className="text-blue-600 text-base md:text-lg font-medium mb-3">{selectedImage.city}</p>
                {selectedImage.description && (
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{selectedImage.description}</p>
                )}
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(selectedImage.takenAt).toLocaleDateString('pt-BR')}</span>
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {imageViewerIndex + 1} de {filteredPhotos.length > 0 ? filteredPhotos.length : photos.length} fotos
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">Adicionar Nova Foto</h3>
                <button
                  onClick={closeUploadModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Seleção de arquivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Imagem
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ {selectedFile.name} selecionado
                  </p>
                )}
              </div>

              {/* Campos de dados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Título da foto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={uploadData.takenAt}
                    onChange={(e) => setUploadData({...uploadData, takenAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <CityAutocomplete
                    value={uploadData.city}
                    onChange={(city) => setUploadData({...uploadData, city})}
                    country={uploadData.country}
                    placeholder="Digite o nome da cidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <CountryAutocomplete
                    value={uploadData.country}
                    onChange={(country) => setUploadData({...uploadData, country})}
                    placeholder="Digite o nome do país"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descrição da foto"
                  rows={3}
                />
              </div>

              {/* Botões */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={closeUploadModal}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUploadWithData}
                  disabled={!selectedFile}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {selectedFile ? 'Fazer Upload' : 'Selecione uma imagem'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Adicionar Cidade */}
      {showAddCityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">Adicionar Nova Cidade</h3>
                <button
                  onClick={closeAddCityModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Completo (Opcional)
                </label>
                <input
                  type="text"
                  value={newCityData.address}
                  onChange={(e) => setNewCityData({...newCityData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Rua das Flores, 123, Centro, São Paulo, SP, Brasil"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Use endereço completo para localização mais precisa
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <CityAutocomplete
                  value={newCityData.city}
                  onChange={(city) => setNewCityData({...newCityData, city})}
                  country={newCityData.country}
                  placeholder="Digite o nome da cidade"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País *
                </label>
                <CountryAutocomplete
                  value={newCityData.country}
                  onChange={(country) => setNewCityData({...newCityData, country})}
                  placeholder="Digite o nome do país"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meio de Transporte
                </label>
                <select
                  value={newCityData.transport}
                  onChange={(e) => setNewCityData({...newCityData, transport: e.target.value as 'plane' | 'train' | 'car'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="plane">✈ Avião</option>
                  <option value="train">🚂 Trem</option>
                  <option value="car">🚐 Motorhome</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordem na Rota
                </label>
                <input
                  type="number"
                  value={newCityData.order}
                  onChange={(e) => setNewCityData({...newCityData, order: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Posição na rota"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Posição na sequência da viagem (1 = primeira parada)
                </p>
              </div>

              {/* Botões */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={closeAddCityModal}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCity}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Adicionar Cidade
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Login */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Login</h2>
              <button
                onClick={() => setShowLogin(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@viagem.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Entrar
              </button>
            </form>
            
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Heart className="h-6 w-6 text-pink-500" />
              <span className="text-xl font-bold">Bruno & Jessica • Bianca & Leonardo & Theo (5 meses)</span>
            </div>
            
            {/* Redes Sociais */}
            <div className="mb-6">
              <SocialMedia size="md" variant="default" showLabels={true} />
            </div>
            
            <p className="text-gray-400">
              Nossa aventura europeia de 2024 - Dois casais, um bebê, uma paixão por viajar!
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Acompanhe nossa jornada em todas as redes sociais
            </p>
        </div>
      </footer>

      {/* Modal de Editar Cidade */}
      {showEditCityModal && editingCity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">Editar Cidade</h3>
                <button
                  onClick={closeEditCityModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Completo (opcional)
                </label>
                <input
                  type="text"
                  value={editCityData.address}
                  onChange={(e) => setEditCityData({...editCityData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Rua das Flores, 123, Centro"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Use endereço completo para localização mais precisa
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <CityAutocomplete
                  value={editCityData.city}
                  onChange={(city) => setEditCityData({...editCityData, city})}
                  country={editCityData.country}
                  placeholder="Digite o nome da cidade"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País *
                </label>
                <CountryAutocomplete
                  value={editCityData.country}
                  onChange={(country) => setEditCityData({...editCityData, country})}
                  placeholder="Digite o nome do país"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meio de Transporte
                </label>
                <select
                  value={editCityData.transport}
                  onChange={(e) => setEditCityData({...editCityData, transport: e.target.value as 'plane' | 'train' | 'car'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="plane">✈️ Avião</option>
                  <option value="train">🚂 Trem</option>
                  <option value="car">🚗 Carro</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordem
                  </label>
                  <input
                    type="number"
                    value={editCityData.order}
                    onChange={(e) => setEditCityData({...editCityData, order: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1"
                    min="1"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editCityData.visited}
                      onChange={(e) => setEditCityData({...editCityData, visited: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Já visitada</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={closeEditCityModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditCity}
                className="flex-1 btn-primary"
              >
                Salvar Alterações
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <footer className="bg-gray-800 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold mb-6">Nossa Viagem pela Europa</h3>
            
            {/* Redes Sociais */}
            <div className="mb-6">
              <SocialMedia size="md" variant="default" showLabels={true} />
            </div>
            
            <p className="text-gray-400">
              Nossa aventura europeia de 2024 - Dois casais, um bebê, uma paixão por viajar!
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Acompanhe nossa jornada em todas as redes sociais
            </p>
        </div>
      </footer>
    </div>
  )
}