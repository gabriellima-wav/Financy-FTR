import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.module'
import { ownedWrite } from '../prisma/owned-write'
import { CategoryInput } from './category.model'

@Injectable()
export class CategoriesService {
  constructor(private db: PrismaService) {}
  list(userId: string) {
    return this.db.category.findMany({
      where: { userId },
      orderBy: [{ title: 'asc' }, { id: 'asc' }],
    })
  }
  create(userId: string, data: CategoryInput) {
    return ownedWrite(
      this.db.category.create({
        data: { ...data, description: data.description ?? '', userId },
      }),
    )
  }
  update(userId: string, id: string, data: CategoryInput) {
    return ownedWrite(
      this.db.category.update({
        where: { id, userId },
        data: { ...data, description: data.description ?? '' },
      }),
    )
  }
  async remove(userId: string, id: string) {
    await ownedWrite(this.db.category.delete({ where: { id, userId } }))
    return true
  }
}
