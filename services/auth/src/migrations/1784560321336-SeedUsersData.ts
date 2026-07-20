import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class SeedUsersData20260720010000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const saltRounds = 10;
        const defaultPassword = 'Password123!';
        const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

        const dummyUsers = [
            { id: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', email: 'admin@enterprise.com', role: 'administrator' },
            { id: 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', email: 'john@author.com', role: 'author' },
            { id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', email: 'customer@user.com', role: 'user' }
        ];

        for (const user of dummyUsers) {
            // Check your User entity fields: if you don't have a "password" column yet,
            // make sure it matches your actual entity property names exactly.
            await queryRunner.query(`
                INSERT INTO "users" (id, email, password) 
                VALUES ('${user.id}', '${user.email}', '${hashedPassword}')
                ON CONFLICT (email) DO NOTHING;
            `);

            // Link users to their roles in the junction table
            await queryRunner.query(`
                INSERT INTO "user_roles" (user_id, role_id)
                SELECT '${user.id}', id FROM "roles" WHERE name = '${user.role}'
                ON CONFLICT DO NOTHING;
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user_roles"`);
        await queryRunner.query(`DELETE FROM "users" WHERE email IN ('admin@enterprise.com', 'john@author.com', 'customer@user.com')`);
    }
}