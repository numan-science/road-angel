export class AuthSuccessDto {
  user: {
    id: number;
    username: string;
    email: string;
    phone: string;
    profilePic: string;
    passwordResetAt: Date;
  };
}