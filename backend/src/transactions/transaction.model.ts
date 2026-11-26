import {
  Field,
  ID,
  InputType,
  ObjectType,
  Int,
  registerEnumType,
} from '@nestjs/graphql'
import {
  IsEnum,
  IsInt,
  IsDateString,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator'
import { Trim } from '../validation'
import { Category } from '../categories/category.model'
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}
registerEnumType(TransactionType, { name: 'TransactionType' })

@InputType()
export class TransactionInput {
  @Field() @Trim() @IsString() @Length(1, 200) description!: string
  @Field()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  date!: string
  @Field(() => Int) @IsInt() @Min(1) @Max(2147483647) amountCents!: number
  @Field(() => TransactionType) @IsEnum(TransactionType) type!: TransactionType
  @Field(() => ID) @IsString() @Length(1, 100) categoryId!: string
}
@ObjectType()
export class Transaction {
  @Field(() => ID) id!: string
  @Field() description!: string
  @Field() date!: string
  @Field(() => Int) amountCents!: number
  @Field(() => TransactionType) type!: TransactionType
  @Field(() => Category) category!: Category
}
