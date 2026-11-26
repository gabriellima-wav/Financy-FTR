import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare, hash } from 'bcrypt'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.module'
import { LoginInput, RegisterInput } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private jwt: JwtService,
  ) {}
  async login({ email, password }: LoginInput) {
    const user = await this.db.user.findUnique({ where: { email } })
    if (!user || !(await compare(password, user.passwordHash)))
      throw new UnauthorizedException('E-mail ou senha inválidos')
    return { user, token: this.jwt.sign({ sub: user.id }) }
  }
  async register({ email, name, password }: RegisterInput) {
    const passwordHash = await hash(password, 12)
    try {
      const user = await this.db.user.create({
        data: { email, name, passwordHash },
      })
      return { user, token: this.jwt.sign({ sub: user.id }) }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ConflictException('E-mail já cadastrado')
      throw error
    }
  }
}
