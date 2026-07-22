import { IsArray, IsEmail, IsString, MinLength } from 'class-validator';

export class PermissionDto {
    @IsString()
    name: string;

    @IsString()
    method: string;

    @IsString()
    path: string;

    // @IsArray()
    // roles: string;
}
