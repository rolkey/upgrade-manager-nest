import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 提供静态文件服务
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // 启用 CORS
  app.enableCors({
    origin: '*', // 允许的来源
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的请求方法
    credentials: true // 是否允许携带凭证
  });

  await app.listen(process.env.APP_PORT || 3000);
  console.log(`🚀 HTTP服务启动成功: http://localhost:${process.env.APP_PORT || 3000}`);
}
bootstrap();
