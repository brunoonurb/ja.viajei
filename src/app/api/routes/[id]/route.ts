import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { geocodeAddress, geocodeCity } from '@/lib/geocoding'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const routeId = params.id
    const body = await request.json()
    const { 
      city, 
      country, 
      transport, 
      order, 
      visited,
      address,
      latitude,
      longitude
    } = body

    // Verificar se a rota existe
    const existingRoute = await prisma.travelRoute.findUnique({
      where: { id: routeId }
    })

    if (!existingRoute) {
      return NextResponse.json({ error: 'Rota não encontrada' }, { status: 404 })
    }

    // Validar dados obrigatórios
    if (!city || !country || !transport) {
      return NextResponse.json({ error: 'Cidade, país e transporte são obrigatórios' }, { status: 400 })
    }

    let finalLatitude = latitude || existingRoute.latitude
    let finalLongitude = longitude || existingRoute.longitude

    // Se as coordenadas mudaram ou não existem, tentar geocodificação
    if (city !== existingRoute.city || country !== existingRoute.country || !finalLatitude || !finalLongitude) {
      try {
        const searchQuery = address || `${city}, ${country}`
        const geocodingResult = await geocodeAddress(searchQuery)
        
        if ('error' in geocodingResult) {
          const cityResult = await geocodeCity(city, country)
          
          if ('error' in cityResult) {
            // Se a geocodificação falhar, manter as coordenadas existentes
            console.warn('Geocodificação falhou, mantendo coordenadas existentes')
          } else {
            finalLatitude = cityResult.lat
            finalLongitude = cityResult.lng
          }
        } else {
          finalLatitude = geocodingResult.lat
          finalLongitude = geocodingResult.lng
        }
      } catch (geocodingError) {
        console.error('Erro na geocodificação:', geocodingError)
        // Manter coordenadas existentes se geocodificação falhar
      }
    }

    // Atualizar a rota
    const updatedRoute = await prisma.travelRoute.update({
      where: { id: routeId },
      data: {
        city,
        country,
        transport,
        order: order !== undefined ? order : existingRoute.order,
        visited: visited !== undefined ? visited : existingRoute.visited,
        latitude: finalLatitude,
        longitude: finalLongitude,
        visitedAt: visited && !existingRoute.visited ? new Date() : existingRoute.visitedAt
      }
    })

    return NextResponse.json(updatedRoute)
  } catch (error) {
    console.error('Erro ao atualizar rota:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const routeId = params.id

    // Verificar se a rota existe
    const existingRoute = await prisma.travelRoute.findUnique({
      where: { id: routeId }
    })

    if (!existingRoute) {
      return NextResponse.json({ error: 'Rota não encontrada' }, { status: 404 })
    }

    // Deletar a rota
    await prisma.travelRoute.delete({
      where: { id: routeId }
    })

    return NextResponse.json({ message: 'Rota deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar rota:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}