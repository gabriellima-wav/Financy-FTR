import { Field, ID, ObjectType, InputType } from '@nestjs/graphql'
import { IsString, Length } from 'class-validator'
import { Trim } from '../validation'

@ObjectType()
export class User {
  @Field(() => ID) id!: string
  @Field() name!: string
  @Field() email!: string
}
@InputType()
export class ProfileInput {
  @Field() @Trim() @IsString() @Length(1, 100) name!: string
}
