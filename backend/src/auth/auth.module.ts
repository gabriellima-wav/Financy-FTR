import { Module, Injectable } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { PassportModule, PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtModule } from '@nestjs/jwt'
import { RecoveryService, RecoveryResolver } from './recovery'
import { AuthService } from './auth.service'
import { LoginInput, RegisterInput, AuthPayload } from './auth.dto'

function secret() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.startsWith('gere-um-'))
    throw new Error('Configure JWT_SECRET no arquivo .env')
  return process.env.JWT_SECRET
}
@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret(),
      algorithms: ['HS256'],
    })
  }
  validate(payload: { sub: string }) {
    return { id: payload.sub }
  }
}
@Resolver()
class AuthResolver {
  constructor(private auth: AuthService) {}
  @Mutation(() => AuthPayload) login(@Args('data') data: LoginInput) {
    return this.auth.login(data)
  }
  @Mutation(() => AuthPayload) register(@Args('data') data: RegisterInput) {
    return this.auth.register(data)
  }
}
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: secret(),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    RecoveryService,
    RecoveryResolver,
  ],
})
export class AuthModule {}
