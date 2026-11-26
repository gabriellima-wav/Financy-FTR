import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.module'
import { ownedWrite } from '../prisma/owned-write'
import { TransactionInput } from './transaction.model'

@Injectable()
export class TransactionsService {
  constructor(private db: PrismaService) {}
  list(userId: string) {
    return this.db.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
    })
  }
  create(userId: string, data: TransactionInput) {
    return ownedWrite(
      this.db.transaction.create({
        data: { ...data, userId },
        include: { category: true },
      }),
    )
  }
  update(userId: string, id: string, data: TransactionInput) {
    return ownedWrite(
      this.db.transaction.update({
        where: { id, userId },
        data,
        include: { category: true },
      }),
    )
  }
  async remove(userId: string, id: string) {
    await ownedWrite(this.db.transaction.delete({ where: { id, userId } }))
    return true
  }
}
