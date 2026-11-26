import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

const request = (ctx: ExecutionContext) =>
  GqlExecutionContext.create(ctx).getContext().req
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(ctx: ExecutionContext) {
    return request(ctx)
  }
}
export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): string => request(ctx).user.id,
)
