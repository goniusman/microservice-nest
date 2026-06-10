// import * as winston from 'winston';
// import { utilities } from 'nest-winston';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as DailyRotateFile from 'winston-daily-rotate-file';

// @Injectable()
// export class WinstonConfig {
//   constructor(private readonly configService: ConfigService) {}

//   error(): winston.transport {
//     return new DailyRotateFile({
//       level: 'error',
//       filename: `logs/error/%DATE%-error.log`,  // ✅ Relative path
//       datePattern: 'YYYY-MM-DD',
//       zippedArchive: true,
//       maxFiles: '5d',
//       format: winston.format.combine(
//         winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
//         utilities.format.nestLike('SEENYOR', { prettyPrint: true }),
//       ),
//     });
//   }

//   info(): winston.transport {
//     return new DailyRotateFile({
//       level: 'info',
//       filename: `logs/info/%DATE%-info.log`,  // ✅ Relative path
//       datePattern: 'YYYY-MM-DD',
//       zippedArchive: true,
//       maxFiles: '2d',
//       format: winston.format.combine(
//         winston.format((info) => {
//           // Skip logging if message contains the metrics route
//           if (info.message?.includes('/api/v1/metrics')) {
//             return false; // filtered out
//           }
//           return info;
//         })(),
//         winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
//         utilities.format.nestLike('SEENYOR', { prettyPrint: true }),
//       ),
//     });
//   }
// }
