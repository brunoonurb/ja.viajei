import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const travelRoutes = [
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

async function main() {
  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('viagem2024', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@viagem.com' },
    update: {},
    create: {
      email: 'admin@viagem.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin'
    }
  })

  console.log('Admin user created:', admin)

  // Criar rotas da viagem
  for (const route of travelRoutes) {
    await prisma.travelRoute.upsert({
      where: { 
        city_order: {
          city: route.city,
          order: route.order
        }
      },
      update: {},
      create: route
    })
  }

  console.log('Travel routes created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })