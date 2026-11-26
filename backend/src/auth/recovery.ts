import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common'
import { Args, Field, InputType, Mutation, Resolver } from '@nestjs/graphql'
import { createHash, randomBytes } from 'node:crypto'
import {
  IsEmail,
  IsByteLength,
  IsString,
  Length,
  Matches,
} from 'class-validator'
import { createTransport } from 'nodemailer'
import { hash } from 'bcrypt'
import { PrismaService } from '../prisma/prisma.module'
import { Trim } from '../validation'

@InputType()
class RecoveryInput {
  @Field() @Trim() @IsEmail() email!: string
}
@InputType()
class ResetInput {
  @Field() @Matches(/^[a-f0-9]{64}$/) token!: string
  @Field() @IsString() @Length(8, 72) @IsByteLength(8, 72) password!: string
}
const digest = (token: string) =>
  createHash('sha256').update(token).digest('hex')
@Injectable()
export class RecoveryService {
  constructor(private db: PrismaService) {}
  async request(email: string) {
    if (!process.env.SMTP_URL || !process.env.MAIL_FROM)
      throw new ServiceUnavailableException(
        'A recuperação por e-mail ainda não foi configurada.',
      )
    const token = randomBytes(32).toString('hex')
    const now = Date.now()
    const result = await this.db.user.updateMany({
      where: {
        email: email.toLowerCase(),
        OR: [
          { resetExpires: null },
          { resetExpires: { lte: new Date(now + 10 * 60000) } },
        ],
      },
      data: {
        resetDigest: digest(token),
        resetExpires: new Date(now + 15 * 60000),
      },
    })
    if (result.count) {
      const url = new URL(
        '/',
        process.env.FRONTEND_URL || 'http://localhost:5173',
      )
      url.hash = 'redefinir=' + token
      try {
        await createTransport(process.env.SMTP_URL).sendMail({
          from: process.env.MAIL_FROM,
          to: email,
          subject: 'Recuperar senha do Financy',
          text:
            'Para definir uma nova senha, abra este link em até 15 minutos: ' +
            url.href,
        })
      } catch {
        await this.db.user.updateMany({
          where: { resetDigest: digest(token) },
          data: { resetDigest: null, resetExpires: null },
        })
        // Preserve the same response for registered and unregistered addresses.
      }
    }
    return true
  }
  async reset({ token, password }: ResetInput) {
    const where = {
      resetDigest: digest(token),
      resetExpires: { gt: new Date() },
    }
    if (!(await this.db.user.findFirst({ where, select: { id: true } })))
      throw new BadRequestException('Link inválido ou expirado.')
    const passwordHash = await hash(password, 12)
    const result = await this.db.user.updateMany({
      where: { ...where, resetExpires: { gt: new Date() } },
      data: { passwordHash, resetDigest: null, resetExpires: null },
    })
    if (!result.count)
      throw new BadRequestException('Link inválido ou expirado.')
    return true
  }
}
@Resolver()
export class RecoveryResolver {
  constructor(private recovery: RecoveryService) {}
  @Mutation(() => Boolean) requestPasswordReset(
    @Args('data') data: RecoveryInput,
  ) {
    return this.recovery.request(data.email)
  }
  @Mutation(() => Boolean) resetPassword(@Args('data') data: ResetInput) {
    return this.recovery.reset(data)
  }
}
