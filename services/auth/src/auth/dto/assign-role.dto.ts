import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class AssignRoleDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: string; // role name
}