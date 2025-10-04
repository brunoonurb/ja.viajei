import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { geocodeAddress, geocodeCity } from '@/lib/geocoding'

// Lista padrão de rotas (mesma do seed)
const defaultRoutes = [
  { city: 'Brasil', country: 'Brasil', transport: 'plane', order: 1 },
  { city: 'Londres', country: 'Reino Unido', transport: 'plane', order: 2 },
  { city: 'Escócia', country: 'Reino Unido', transport: 'train', order: 3 },
  { city: 'Londres', country: 'Reino Unido', transport: 'train', order: 4 },
  { city: 'Paris', country: 'França', transport: 'plane', order: 5 },
  { city: 'Milão', country: 'Itália', transport: 'plane', order: 6 },
  { city: 'Lugano', country: 'Suíça', transport: 'car', order: 7 },
  { city: 'Zurique', country: 'Suíça', transport: 'car', order: 8 },
  { city: 'Luxemburgo', country: 'Luxemburgo', transport: 'car', order: 9 },
  { city: 'Bruxelas', country: 'Bélgica', transport: 'car', order: 10 },
  { city: 'Amsterdã', country: 'Holanda', transport: 'car', order: 11 },
  { city: 'Sønderborg', country: 'Dinamarca', transport: 'car', order: 12 },
  { city: 'Hamburgo', country: 'Alemanha', transport: 'car', order: 13 },
  { city: 'Berlim', country: 'Alemanha', transport: 'car', order: 14 },
  { city: 'Zary', country: 'Polônia', transport: 'car', order: 15 },
  { city: 'Praga', country: 'República Tcheca', transport: 'car', order: 16 },
  { city: 'Viena', country: 'Áustria', transport: 'car', order: 17 },
  { city: 'Bratislava', country: 'Eslováquia', transport: 'car', order: 18 },
  { city: 'Szombathely', country: 'Hungria', transport: 'car', order: 19 },
  { city: 'Zagreb', country: 'Croácia', transport: 'car', order: 20 },
  { city: 'Liubliana', country: 'Eslovênia', transport: 'car', order: 21 },
  { city: 'Veneza', country: 'Itália', transport: 'car', order: 22 },
  { city: 'Ravena', country: 'Itália', transport: 'car', order: 23 },
  { city: 'Roma', country: 'Itália', transport: 'car', order: 24 },
  { city: 'Montepulciano', country: 'Itália', transport: 'car', order: 25 },
  { city: 'Pisa', country: 'Itália', transport: 'car', order: 26 },
  { city: 'Florença', country: 'Itália', transport: 'car', order: 27 },
  { city: 'Monaco', country: 'Mônaco', transport: 'car', order: 28 },
  { city: 'Turim', country: 'Itália', transport: 'car', order: 29 },
  { city: 'Milão', country: 'Itália', transport: 'car', order: 30 }
]

export async function GET() {
  try {
    const routes = await prisma.travelRoute.findMany({
      orderBy: { order: 'asc' }
    })
    
    // Se não houver rotas no banco, retorna a lista padrão
    if (routes.length === 0) {
      return NextResponse.json(defaultRoutes)
    }
    
    return NextResponse.json(routes)
  } catch (error) {
    console.error('Erro ao buscar rotas:', error)
    // Em caso de erro, também retorna a lista padrão
    return NextResponse.json(defaultRoutes)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      city, 
      country, 
      transport, 
      order, 
      visited = false,
      address, // Novo campo para endereço completo
      latitude, // Coordenadas opcionais
      longitude
    } = body

    if (!city || !country || !transport) {
      return NextResponse.json({ error: 'Cidade, país e transporte são obrigatórios' }, { status: 400 })
    }

    let finalLatitude = latitude
    let finalLongitude = longitude

    // Se não foram fornecidas coordenadas, tentar geocodificação
    if (!finalLatitude || !finalLongitude) {
      try {
        // Tentar com endereço completo primeiro, depois com cidade + país
        const searchQuery = address || `${city}, ${country}`
        const geocodingResult = await geocodeAddress(searchQuery)
        
        if ('error' in geocodingResult) {
          // Se falhar com endereço completo, tentar apenas cidade + país
          const cityResult = await geocodeCity(city, country)
          
          if ('error' in cityResult) {
            return NextResponse.json({ 
              error: 'Geocodificação falhou', 
              details: cityResult.message 
            }, { status: 400 })
          }
          
          finalLatitude = cityResult.lat
          finalLongitude = cityResult.lng
        } else {
          finalLatitude = geocodingResult.lat
          finalLongitude = geocodingResult.lng
        }
      } catch (geocodingError) {
        console.error('Erro na geocodificação:', geocodingError)
        return NextResponse.json({ 
          error: 'Erro na geocodificação', 
          details: 'Não foi possível obter as coordenadas do endereço' 
        }, { status: 400 })
      }
    }

    const newRoute = await prisma.travelRoute.create({
      data: {
        city,
        country,
        transport,
        order: order || 1,
        visited,
        latitude: finalLatitude,
        longitude: finalLongitude
      }
    })

    return NextResponse.json(newRoute)
  } catch (error) {
    console.error('Erro ao criar rota:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}