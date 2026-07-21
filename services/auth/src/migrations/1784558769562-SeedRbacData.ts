import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class SeedRbacData20260720000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Seed Core Permissions with unique, valid UUID strings
        const permissions = [
            // User Permissions
            { id: '11111111-1111-1111-1111-111111111111', name: 'user:create', method: 'POST', path: '/users' },
            { id: '11111111-1111-1111-1111-222222222222', name: 'user:read', method: 'GET', path: '/users' },
            { id: '11111111-1111-1111-1111-333333333333', name: 'user:read_one', method: 'GET', path: '/users/:id' },
            { id: '11111111-1111-1111-1111-444444444444', name: 'user:update', method: 'PUT', path: '/users/:id' },
            { id: '11111111-1111-1111-1111-555555555555', name: 'user:delete', method: 'DELETE', path: '/users/:id' },

            // Book Permissions
            { id: '22222222-2222-2222-2222-111111111111', name: 'book:create', method: 'POST', path: '/books' },
            { id: '22222222-2222-2222-2222-222222222222', name: 'book:read', method: 'GET', path: '/books' },
            { id: '22222222-2222-2222-2222-333333333333', name: 'book:read_one', method: 'GET', path: '/books/:id' },
            { id: '22222222-2222-2222-2222-444444444444', name: 'book:update', method: 'PUT', path: '/books/:id' },
            { id: '22222222-2222-2222-2222-555555555555', name: 'book:delete', method: 'DELETE', path: '/books/:id' },
            
            // Order Permissions
            { id: '33333333-3333-3333-3333-111111111111', name: 'order:create', method: 'POST', path: '/orders' },
            { id: '33333333-3333-3333-3333-222222222222', name: 'order:get', method: '*', path: '/orders/:id' },
            { id: '33333333-3333-3333-3333-333333333333', name: 'order:update', method: 'PUT', path: '/orders/:id' },
            { id: '33333333-3333-3333-3333-444444444444', name: 'order:delete', method: 'DELETE', path: '/orders/:id' },

            // Review Permissions
            { id: '44444444-4444-4444-4444-111111111111', name: 'review:create', method: 'POST', path: '/reviews' },
            { id: '44444444-4444-4444-4444-222222222222', name: 'review:read', method: 'GET', path: '/reviews' },
            { id: '44444444-4444-4444-4444-333333333333', name: 'review:read_one', method: 'GET', path: '/reviews/:id' },
            { id: '44444444-4444-4444-4444-444444444444', name: 'review:book_id', method: 'GET', path: '/reviews/book/:bookId' },
            { id: '44444444-4444-4444-4444-555555555555', name: 'review:update', method: 'PUT', path: '/reviews/:id' },
            { id: '44444444-4444-4444-4444-666666666666', name: 'review:delete', method: 'DELETE', path: '/reviews/:id' },
        ];

        for (const perm of permissions) {
            await queryRunner.query(`
                INSERT INTO "permissions" (id, name, "httpMethod", "pathPattern") 
                VALUES ('${perm.id}', '${perm.name}', '${perm.method}', '${perm.path}')
                ON CONFLICT (name) DO NOTHING;
            `);
        }

        // 2. Seed Base Enterprise Roles
        const roles = ['administrator', 'moderator', 'author', 'user'];
        for (const role of roles) {
            await queryRunner.query(`
                INSERT INTO "roles" (name) VALUES ('${role}')
                ON CONFLICT (name) DO NOTHING;
            `);
        }

        // 3. Link Roles to Permissions (role_permissions)
        // Administrator gets EVERYTHING
        await queryRunner.query(`
            INSERT INTO "role_permissions" (role_id, permission_id)
            SELECT r.id, p.id FROM "roles" r, "permissions" p WHERE r.name = 'administrator' ON CONFLICT DO NOTHING;
        `);

        // Moderator can read everything and delete reviews/books
        await queryRunner.query(`
            INSERT INTO "role_permissions" (role_id, permission_id)
            SELECT r.id, p.id FROM "roles" r, "permissions" p 
            WHERE r.name = 'moderator' AND p.name IN ('book:read', 'book:read_one', 'book:delete', 'review:delete')
            ON CONFLICT DO NOTHING;
        `);

        // Author can create/update books and write reviews
        await queryRunner.query(`
            INSERT INTO "role_permissions" (role_id, permission_id)
            SELECT r.id, p.id FROM "roles" r, "permissions" p 
            WHERE r.name = 'author' AND p.name IN ('book:create', 'book:read', 'book:read_one', 'book:update', 'review:create')
            ON CONFLICT DO NOTHING;
        `);

        // 4. Seed Dummy Users with Hashed Passwords
        const saltRounds = 10;
        const defaultPassword = 'Password123!';
        const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

        const dummyUsers = [
            { id: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', name: 'Admin User', email: 'admin@enterprise.com', role: 'administrator' },
            { id: 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', name: 'Author John', email: 'john@author.com', role: 'author' },
            { id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Regular Customer', email: 'customer@user.com', role: 'user' },
            { id: 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', name: 'Regular Moderator', email: 'moderator@enterprise.com', role: 'moderator' }
        ];

        for (const user of dummyUsers) {
            await queryRunner.query(`
                INSERT INTO "users" (id, email, password) 
                VALUES ('${user.id}', '${user.email}', '${hashedPassword}')
                ON CONFLICT (email) DO NOTHING;
            `);

            // 5. Link Users to Roles (user_roles junction table)
            await queryRunner.query(`
                INSERT INTO "user_roles" (user_id, role_id)
                SELECT '${user.id}', id FROM "roles" WHERE name = '${user.role}'
                ON CONFLICT DO NOTHING;
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user_roles"`);
        await queryRunner.query(`DELETE FROM "role_permissions"`);
        await queryRunner.query(`DELETE FROM "users"`);
        await queryRunner.query(`DELETE FROM "roles"`);
        await queryRunner.query(`DELETE FROM "permissions"`);
    }
}