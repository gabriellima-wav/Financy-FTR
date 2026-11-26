import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.module'
import { ProfileInput } from './user.model'

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}
  me(id: string) {
    return this.db.user.findUniqueOrThrow({ where: { id } })
  }
  update(id: string, data: ProfileInput) {
    return this.db.user.update({ where: { id }, data })
  }
}
