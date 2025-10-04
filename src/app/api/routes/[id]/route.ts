import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { visited, visitedAt } = body

    const route = await prisma.travelRoute.update({
      where: { id },
      data: {
        visited,
        visitedAt: visitedAt ? new Date(visitedAt) : null
      }
    })

    return NextResponse.json(route)
  } catch (error) {
    console.error('Erro ao atualizar rota:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}