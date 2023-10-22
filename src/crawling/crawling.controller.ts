import { Body, Controller, Post } from '@nestjs/common';
import { CrawlingService } from './crawling.service';

@Controller('crawling')
export class CrawlingController {
  constructor(private crawlingService: CrawlingService) {}

  @Post()
  async crawShopInfo(@Body() shopInfo): Promise<any> {
    return await this.crawlingService.crawShopInfo(shopInfo);
  }
}
