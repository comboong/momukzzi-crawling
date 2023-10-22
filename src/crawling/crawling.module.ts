import { Module } from '@nestjs/common';
import { CrawlingService } from './crawling.service';
import { CrawlingController } from './crawling.controller';
import { GetShopInfoService } from './services/getShpoInfo.service';

@Module({
  providers: [CrawlingService, GetShopInfoService],
  controllers: [CrawlingController],
})
export class CrawlingModule {}
