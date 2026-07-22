// // auth-service/typeorm.config.ts
// import { DataSource } from 'typeorm';
// import * as dotenv from 'dotenv';
// import { join } from 'path';

// // Load .env variables explicitly for CLI runtime context
// dotenv.config();

// export default new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '5432', 10),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME_AUTH,
  
//   // Point directly to your compiled or raw entity files
//   entities: [join(__dirname, 'src/**/*.entity{.ts,.js}')],
  
//   // Location where your generated migrations will live
//   migrations: [join(__dirname, 'src/migrations/*{.ts,.js}')],
//   synchronize: false,
// });