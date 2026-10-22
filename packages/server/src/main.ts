import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix(app.get('ConfigService').get('SERVER_API_PREFIX', '/api'));
  app.use(
    rateLimit({
      // 1 Minute
      windowMs: 60 * 1000,
      // Limit Each IP To 1000 Requests Per windowMs
      max: 10000,
    })
  );
  // Enable gzip Compression
  app.use(compression());
  app.use(helmet());
  // Under Normal Circumstances, The Response Value Is Uniform
  app.useGlobalInterceptors(new TransformInterceptor());
  // Under Abnormal Circumstances, The Response Value Is Unified
  app.useGlobalFilters(new HttpExceptionFilter());
  // Modify The Requested Capacity
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Blogify Open API')
    .setDescription('Blogify Open API Document')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(app.get('ConfigService').get('SERVER_PORT', 3015), '127.0.0.1');
  console.log('[Blogify] Service Started Successfully');
}

bootstrap();
