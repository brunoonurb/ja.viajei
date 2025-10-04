import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const routes = await prisma.travelRoute.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(routes)
  } catch (error) {
    console.error('Erro ao buscar rotas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { city, country, transport, order, visited = false } = body

    if (!city || !country || !transport) {
      return NextResponse.json({ error: 'Cidade, país e transporte são obrigatórios' }, { status: 400 })
    }

    const newRoute = await prisma.travelRoute.create({
      data: {
        city,
        country,
        transport,
        order: order || 1,
        visited
      }
    })

    return NextResponse.json(newRoute)
  } catch (error) {
    console.error('Erro ao criar rota:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}