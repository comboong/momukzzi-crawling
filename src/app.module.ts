import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { CrawlingModule } from './crawling/crawling.module';

@Module({
  imports: [CrawlingModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
