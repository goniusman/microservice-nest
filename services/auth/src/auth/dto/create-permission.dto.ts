import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', '*'])
  method: string;

  @IsNotEmpty()
  @IsString()
  path: string;
}