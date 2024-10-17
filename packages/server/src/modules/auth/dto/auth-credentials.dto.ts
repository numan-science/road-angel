import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
export class AuthCredentialsDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @IsOptional()
  @IsBoolean()
  rememberMe: boolean = false;
}
