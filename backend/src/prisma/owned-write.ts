import { ConflictException, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'

export async function ownedWrite<T>(operation: Promise<T>): Promise<T> {
  try {
    return await operation
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025')
        throw new NotFoundException('Registro não encontrado')
      if (error.code === 'P2003')
        throw new ConflictException(
          'Categoria indisponível ou vinculada a transações',
        )
    }
    throw error
  }
}
