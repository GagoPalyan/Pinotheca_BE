import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class ResetPasswordDto {
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Token cannot be empty' })
  token: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must not exceed 32 characters' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Password must meet complexity requirements' },
  )
  password: string;

  @IsString({ message: 'Confirm password must be a string' })
  @IsNotEmpty({ message: 'Confirm password cannot be empty' })
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
