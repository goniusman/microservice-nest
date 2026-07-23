import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { PermissionDto } from './dto/permission.dto';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    // private readonly permissionRepository: Repository<Permission>,
    private readonly jwtService: JwtService,
  ) { }

  private async generateAccessToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.roles,
    };

    return this.jwtService.sign(payload);
  }

  private async generateTokens(user: User) {

    const permissions = new Set<string>();
    user.roles.forEach(role => {
      role.permissions.forEach(perm => permissions.add(perm.name));
    });

    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles.map(r => r.name),
      permissions: Array.from(permissions),
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // Triggered once upon Login or Token generation to build the user cache
  async buildAndCachePermissions(userId: string): Promise<any[]> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId as any // Casting as any safely bypasses strict UUID string matching bottlenecks
      },
      relations: {
        roles: {
          permissions: true
        }
      } as FindOptionsRelations<User> // Explicitly enforces the correct TypeORM relation structural contract
    });
    if (!user) throw new UnauthorizedException('User not found');

    const compiledPermissions = new Map<string, { method: string; path: string }>();

    user.roles.forEach((role) => {
      role.permissions.forEach((perm) => {
        const key = `${perm.method}:${perm.path}`;
        compiledPermissions.set(key, { method: perm.method, path: perm.path });
      });
    });

    const permissionList = Array.from(compiledPermissions.values());
    const roleList = user.roles.map(r => r.name);

    // Save to Redis for sub-millisecond lookups later
    // await this.redis.set(`user:perms:${userId}`, JSON.stringify({ permissions: permissionList, roles: roleList }), 3600);

    return permissionList;
  }


  // Intercepts NGINX auth requests
  // async validateRequest(userId: string, incomingMethod: string, incomingUri: string): Promise<{ authorized: boolean; roles: string[] }> {
  //   // 1. Fetch compiled permissions from Redis cache (fallback to DB if cache missed)
  //   // const cachedData = JSON.parse(await this.redis.get(`user:perms:${userId}`));
  //   const sampleCachedData = {
  //     roles: ['moderator'],
  //     permissions: [
  //       { method: 'GET', path: '/books' },
  //       { method: 'GET', path: '/books/:id' },
  //       { method: 'POST', path: '/books' },
  //       { method: 'DELETE', path: '/books/:id' },
  //       { method: '*', path: '/books/:bookId/reviews*' } // Covers all review sub-routes
  //     ]
  //   };

  //   const cleanPath = incomingUri.split('?')[0]; // Strip out query params (?sort=asc)

  //   const isMatch = sampleCachedData.permissions.some((rule) => {
  //     const methodMatch = rule.method === '*' || rule.method.toUpperCase() === incomingMethod.toUpperCase();
  //     if (!methodMatch) return false;

  //     const regex = pathToRegexp(rule.path);
  //     return regex.test(cleanPath);
  //   });

  //   return { authorized: isMatch, roles: sampleCachedData.roles };
  // }

  private async hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto): Promise<User> {
    const user = await this.findOne(id); // throws if not found
    Object.assign(user, UpdateAuthDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: {
          email: registerDto.email,
        },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = this.userRepository.create({
        email: registerDto.email,
        password: hashedPassword,
      });

      await this.userRepository.save(user);

      return {
        message: 'User registered successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: loginDto.email,
        },

      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // const accessToken =
      //   await this.generateAccessToken(user);

      const tokens = await this.generateTokens(user);

      const hashed = await this.hashToken(tokens.refreshToken);

      await this.userRepository.update(user.id, {
        refreshToken: hashed,
      });

      return {
        message: 'Login successful',
        userId: user.id,
        tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Refresh Token Not Found!');
      }

      const hashed = await this.hashToken(token);

      if (hashed !== user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);

      const newHashed = await this.hashToken(tokens.refreshToken);

      await this.userRepository.update(user.id, {
        refreshToken: newHashed,
      });

      return tokens;
    } catch (err) {
      throw err;
    }
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, {
      refreshToken: '',
    });

    return {
      message: 'Logged out successfully',
    };
  }

  async assignRole(email: string, roleName: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const role = await this.roleRepository.findOneBy({ name: roleName });
    if (!role) {
      throw new NotFoundException(`Role '${roleName}' not found`);
    }

    const alreadyHasRole = user.roles.some((r) => r.id === role.id);
    if (!alreadyHasRole) {
      user.roles.push(role);
    }

    return this.userRepository.save(user);
  }

}



@Injectable()
export class PermissionService {

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly jwtService: JwtService,
  ) { }

  async create(permissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(permissionDto);
    try {
      return await this.permissionRepository.save(permission);
    } catch (err: any) {
      if (err.code === '23505') { // Postgres unique violation
        throw new ConflictException('Permission name already in use');
      }
      throw err;
    }
  }

  async findAll(page = 1, limit = 10): Promise<{ data: Permission[]; total: number }> {
    const [data, total] = await this.permissionRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }
    return permission; // TS narrows this to `Permission` here, not null
  }

  async update(id: string, permissionDto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.findOne(id);

    if (permissionDto.name && permissionDto.name !== permission.name) {
      const existing = await this.permissionRepository.findOneBy({ name: permissionDto.name });
      if (existing) {
        throw new ConflictException('Permission name already in use');
      }
    }

    Object.assign(permission, permissionDto);
    return this.permissionRepository.save(permission);
  }

  async remove(id: string): Promise<void> {
    const result = await this.permissionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }


}



@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) { }

  // Helper: resolve permission ids -> Permission entities, throws if any are missing
  private async resolvePermissions(permissionIds?: string[]): Promise<Permission[]> {
    if (!permissionIds || permissionIds.length === 0) {
      return [];
    }
    const permissions = await this.permissionRepository.findBy({ id: In(permissionIds) });

    if (permissions.length !== permissionIds.length) {
      const foundIds = permissions.map((p) => p.id);
      const missing = permissionIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Permission(s) not found: ${missing.join(', ')}`);
    }

    return permissions;
  }

  // CREATE
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existing = await this.roleRepository.findOneBy({ name: createRoleDto.name });
    if (existing) {
      throw new ConflictException('Role name already in use');
    }

    const permissions = await this.resolvePermissions(createRoleDto.permissionIds);

    const role = this.roleRepository.create({
      name: createRoleDto.name,
      permissions,
    });

    return this.roleRepository.save(role);
  }

  // READ ALL
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
    // permissions load automatically since the relation is `eager: true`
  }

  // READ ONE
  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  // UPDATE
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existing = await this.roleRepository.findOneBy({ name: updateRoleDto.name });
      if (existing) {
        throw new ConflictException('Role name already in use');
      }
      role.name = updateRoleDto.name;
    }

    if (updateRoleDto.permissionIds !== undefined) {
      role.permissions = await this.resolvePermissions(updateRoleDto.permissionIds);
    }

    return this.roleRepository.save(role);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
  }


  async findByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ name });
    if (!role) {
      throw new NotFoundException(`Role '${name}' not found`);
    }
    return role;
  }

  async assignPermissionsByName(roleName: string, permissionNames: string[]): Promise<Role> {
    const role = await this.findByName(roleName);

    const permissions = await this.permissionRepository.findBy({ name: In(permissionNames) });

    if (permissions.length !== permissionNames.length) {
      const foundNames = permissions.map((p) => p.name);
      const missing = permissionNames.filter((n) => !foundNames.includes(n));
      throw new NotFoundException(`Permission(s) not found: ${missing.join(', ')}`);
    }

    role.permissions = permissions;
    return this.roleRepository.save(role);
  }








}