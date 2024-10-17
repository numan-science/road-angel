import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ForgotPasswordService } from '../forgot-password.service';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(
    @Inject(ForgotPasswordService) private readonly forgotPasswordService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const [req] = context.getArgs();
    const token = (req.params && req.params.token) || null;
    if (token) {
      return this.forgotPasswordService.isTokenValid(token);
    }
    return false;
  }
}
