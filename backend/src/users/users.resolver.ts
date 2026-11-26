import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser, GqlAuthGuard } from '../auth/guard'
import { ProfileInput, User } from './user.model'
import { UsersService } from './users.service'

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(private users: UsersService) {}
  @Query(() => User) me(@CurrentUser() id: string) {
    return this.users.me(id)
  }
  @Mutation(() => User) updateProfile(
    @CurrentUser() id: string,
    @Args('data') data: ProfileInput,
  ) {
    return this.users.update(id, data)
  }
}
