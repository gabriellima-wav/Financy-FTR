import { Field, InputType, ObjectType } from '@nestjs/graphql'
import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  IsByteLength,
} from 'class-validator'
import { Transform } from 'class-transformer'
import { Trim } from '../validation'
import { User } from '../users/user.model'

@InputType()
export class LoginInput {
  @Field()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email!: string
  @Field() @IsString() @Length(8, 72) @IsByteLength(8, 72) password!: string
}
@InputType()
export class RegisterInput extends LoginInput {
  @Field() @Trim() @IsString() @Length(1, 100) name!: string
}
@ObjectType()
export class AuthPayload {
  @Field() token!: string
  @Field(() => User) user!: User
}
