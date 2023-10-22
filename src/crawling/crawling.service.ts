import { Injectable } from '@nestjs/common';
import { GetShopInfoService } from './services/getShpoInfo.service';
import { ShopInfo } from './interface/shopInfo.interface';
import {
  CrawedShopInfo,
  shopInfoWithCrawling,
} from './interface/shopInfoWithCrwaling.interface';

@Injectable()
export class CrawlingService {
  constructor(private getShopInfo: GetShopInfoService) {}

  async crawShopInfo(shopInfo: ShopInfo[]): Promise<shopInfoWithCrawling[]> {
    process.setMaxListeners(20);
    const responce: shopInfoWithCrawling[] = await Promise.all(
      shopInfo.map(async (shop) => {
        const crawlingInfo: CrawedShopInfo =
          await this.getShopInfo.crawShopInfo(shop.place_url);
        return { ...shop, ...crawlingInfo };
      }),
    );

    return responce;
  }
}
