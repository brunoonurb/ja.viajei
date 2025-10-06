'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { 
  Heart, 
  MapPin, 
  Camera, 
  Globe, 
  Users, 
  Plane, 
  Train, 
  Car,
  ArrowRight,
  Star,
  Lock
} from 'lucide-react'
import SocialMedia from '@/components/SocialMedia'

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

export default function Home() {
  const [routes, setRoutes] = useState<TravelRoute[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

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

  // Agrupar cidades por país
  const routesByCountry = Array.isArray(routes) ? routes.reduce((acc, route) => {
    if (!acc[route.country]) {
      acc[route.country] = []
    }
    acc[route.country].push(route)
    return acc
  }, {} as Record<string, TravelRoute[]>) : {}

  // Contar fotos por país
  const getCountryPhotos = (country: string) => {
    return Array.isArray(photos) ? photos.filter(photo => photo.country.toLowerCase() === country.toLowerCase()) : []
  }

  // Contar fotos por transporte
  const getTransportCount = (transport: string) => {
    return Array.isArray(routes) ? routes.filter(route => route.transport === transport).length : 0
  }
  const stats = [
    { icon: MapPin, value: Array.isArray(routes) ? routes.length.toString() : '0', label: 'Cidades', color: 'text-blue-600' },
    { icon: Globe, value: Object.keys(routesByCountry).length.toString(), label: 'Países', color: 'text-purple-600' },
    { icon: Users, value: '5', label: 'Aventureiros', color: 'text-pink-600' },
    { icon: Camera, value: Array.isArray(photos) ? photos.length.toString() : '0', label: 'Memórias', color: 'text-green-600' }
  ]

  const transportStats = [
    { icon: Plane, count: getTransportCount('plane').toString(), label: 'Voos' },
    { icon: Train, count: getTransportCount('train').toString(), label: 'Trens' },
    { icon: Car, count: getTransportCount('car').toString(), label: 'Cidades de Motorhome' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Carregando aventura...</p>
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
            <div className="flex items-center space-x-3">
              <Image
                src="/javiajei_watermark_800.png"
                alt="Já Viajei"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold gradient-text">
                  Já Viajei
                </h1>
                <p className="text-sm text-gray-600">Nossa Aventura Europeia</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Redes Sociais */}
              <div>
                <SocialMedia size="sm" variant="compact" />
              </div>
              
              <Link
                href="/viagem"
                className="btn-primary flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-2 sm:px-4 py-2"
              >
                <span className="hidden sm:inline">Ver Viagem</span>
                <span className="sm:hidden">Viagem</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin"
                className="btn-secondary flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-2 sm:px-4 py-2"
              >
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Banner */}
        <section className="relative py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-xl overflow-hidden shadow-lg"
            >
              {/* TODO ver tamanho da imagem */}
              <Image
                src="/banner_retangular2.png"
                alt="Banner Já Viajei"
                width={1200}
                height={300}
                className="w-full h-65 object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                {/* <h2 className="text-2xl md:text-3xl font-bold mb-1">
                  Já Viajei
                </h2> */}
                <p className="text-sm md:text-base opacity-90">
                  Acompanhe nossa aventura europeia
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center space-x-3 mb-8">
                <Heart className="h-12 w-12 text-pink-500" />
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold gradient-text">
                  Dois Casais, Um Bebê, Uma Aventura
                </h2>
                <Heart className="h-12 w-12 text-pink-500" />
              </div>
              
              <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl mx-auto text-balance">
                Acompanhe nossa jornada épica pela Europa! Dois casais e o pequeno Theo (5 meses) 
                explorando 30 cidades de avião, trem e motorhome em uma aventura inesquecível.
              </p>

              {/* Casais e Bebê */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg">
                  <h3 className="text-lg md:text-xl font-bold">Bruno & Jessica</h3>
                  <p className="text-blue-100 text-sm md:text-base">Casal Aventureiro</p>
                </div>
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg">
                  <h3 className="text-lg md:text-xl font-bold">Bianca & Leonardo</h3>
                  <p className="text-pink-100 text-sm md:text-base">Dupla Exploradora</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg">
                  <h3 className="text-lg md:text-xl font-bold">👶 Theo</h3>
                  <p className="text-yellow-100 text-sm md:text-base">5 meses - Pequeno Explorador</p>
                </div>
              </div>

              {/* Estatísticas de Transporte */}
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                {transportStats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <Icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-800">{stat.count}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </motion.div>
                  )
                })}
              </div>

              <Link
                href="/viagem"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
              >
                <span>Explorar Nossa Viagem</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Estatísticas */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Números da Nossa Aventura
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Uma jornada épica que vai ficar para sempre na nossa memória
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center group hover:scale-105 transition-transform duration-300"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Rota Preview */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Nossa Rota Completa
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Do Brasil à Europa, explorando {Array.isArray(routes) ? routes.length : 0} cidades em {Object.keys(routesByCountry).length} países
              </p>
            </motion.div>

            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {Object.entries(routesByCountry).map(([country, countryRoutes], index) => {
                  const countryPhotosCount = getCountryPhotos(country).length
                  return (
                    <motion.div
                      key={country}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => window.location.href = '/viagem'}
                    >
                      <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 font-medium text-sm md:text-base truncate">{country}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">({countryRoutes.length})</span>
                      </div>
                      {countryPhotosCount > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                          📸 {countryPhotosCount}
                        </span>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Star className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Acompanhe Nossa Jornada
              </h3>
              <p className="text-xl mb-8 text-blue-100">
                Cada foto, cada cidade, cada memória compartilhada com vocês
              </p>
              <Link
                href="/viagem"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
              >
                <span>Ver Galeria Completa</span>
                <Camera className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
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
    </div>
  )
}