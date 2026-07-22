import { IsNotEmpty, IsString, IsArray, IsUUID, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[]; // ids of Permission entities to attach
}