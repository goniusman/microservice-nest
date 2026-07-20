// auth-service/src/auth/entities/permission.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // e.g., 'book:create', 'review:delete'

  @Column()
  httpMethod: string; // 'POST', 'GET', 'PUT', 'DELETE', or '*' for all

  @Column()
  pathPattern: string; // e.g., '/books', '/books/:id', '/orders/*'

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}