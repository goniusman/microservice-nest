import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class AssignPermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissions: string[]; // permission *names*, matching the seed script
}