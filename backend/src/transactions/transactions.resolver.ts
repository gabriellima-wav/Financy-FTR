import { UseGuards } from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser, GqlAuthGuard } from '../auth/guard'
import { Transaction, TransactionInput } from './transaction.model'
import { TransactionsService } from './transactions.service'

@Resolver(() => Transaction)
@UseGuards(GqlAuthGuard)
export class TransactionsResolver {
  constructor(private service: TransactionsService) {}
  @Query(() => [Transaction])
  listTransactions(@CurrentUser() userId: string) {
    return this.service.list(userId)
  }

  @Mutation(() => Transaction)
  createTransaction(
    @CurrentUser() userId: string,
    @Args('data') data: TransactionInput,
  ) {
    return this.service.create(userId, data)
  }
  @Mutation(() => Transaction)
  updateTransaction(
    @CurrentUser() userId: string,
    @Args('id', { type: () => ID }) id: string,
    @Args('data') data: TransactionInput,
  ) {
    return this.service.update(userId, id, data)
  }
  @Mutation(() => Boolean)
  deleteTransaction(
    @CurrentUser() userId: string,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.service.remove(userId, id)
  }
}
