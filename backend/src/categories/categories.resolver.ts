import { UseGuards } from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser, GqlAuthGuard } from '../auth/guard'
import { Category, CategoryInput } from './category.model'
import { CategoriesService } from './categories.service'

@Resolver(() => Category)
@UseGuards(GqlAuthGuard)
export class CategoriesResolver {
  constructor(private service: CategoriesService) {}
  @Query(() => [Category])
  listCategories(@CurrentUser() userId: string) {
    return this.service.list(userId)
  }

  @Mutation(() => Category)
  createCategory(
    @CurrentUser() userId: string,
    @Args('data') data: CategoryInput,
  ) {
    return this.service.create(userId, data)
  }
  @Mutation(() => Category)
  updateCategory(
    @CurrentUser() userId: string,
    @Args('id', { type: () => ID }) id: string,
    @Args('data') data: CategoryInput,
  ) {
    return this.service.update(userId, id, data)
  }
  @Mutation(() => Boolean)
  deleteCategory(
    @CurrentUser() userId: string,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.service.remove(userId, id)
  }
}
