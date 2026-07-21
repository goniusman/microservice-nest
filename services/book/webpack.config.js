// services/auth/webpack.config.js
module.exports = function (options, webpack) {
  return {
    ...options,
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          const lazyImports = [
            'mqtt',
            'nats',
            'kafkajs',
            'amqplib',
            'amqp-connection-manager',
            'ioredis',
            'typeorm',
            '@nestjs/websockets',
            '@nestjs/microservices',
          ];
          if (!lazyImports.includes(resource)) {
            return false;
          }
          try {
            require.resolve(resource, { paths: [process.cwd()] });
            return false;
          } catch (err) {
            return true;
          }
        },
      }),
    ],
  };
};