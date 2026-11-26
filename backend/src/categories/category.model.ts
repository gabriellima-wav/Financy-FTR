import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { IsIn, IsOptional, IsString, Length, MaxLength } from 'class-validator'
import { Trim } from '../validation'
const icons = [
  'briefcase-business',
  'car-front',
  'heart-pulse',
  'piggy-bank',
  'shopping-cart',
  'ticket',
  'tool-case',
  'utensils',
  'paw-print',
  'house',
  'gift',
  'dumbbell',
  'book-open',
  'baggage-claim',
  'mailbox',
  'receipt-text',
]
const colors = ['green', 'blue', 'purple', 'pink', 'red', 'orange', 'yellow']

@InputType()
export class CategoryInput {
  @Field() @Trim() @IsString() @Length(1, 100) title!: string
  @Field({ nullable: true })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(300)
  description?: string
  @Field() @IsIn(icons) icon!: string
  @Field() @IsIn(colors) color!: string
}
@ObjectType()
export class Category {
  @Field(() => ID) id!: string
  @Field() description!: string
  @Field() title!: string
  @Field() color!: string
  @Field() icon!: string
}
