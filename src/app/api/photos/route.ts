import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: { takenAt: 'desc' }
    })
    return NextResponse.json(photos)
  } catch (error) {
    console.error('Erro ao buscar fotos:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, city, country, imageData, imageType } = body

    const photo = await prisma.photo.create({
      data: {
        title,
        description,
        city,
        country,
        imageData,
        imageType,
        userId: 'cmgbncb7h0000h6xbd13uusbv' // Admin user ID
      }
    })

    return NextResponse.json(photo)
  } catch (error) {
    console.error('Erro ao criar foto:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}