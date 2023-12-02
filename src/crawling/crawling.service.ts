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
    const result = [];

    process.setMaxListeners(20);

    const shoplist: shopInfoWithCrawling[] = await Promise.all(
      shopInfo.map(async (shop) => {
        try {
          const crawlingInfo: CrawedShopInfo =
            await this.getShopInfo.crawShopInfo(shop.place_url);

          return { ...shop, ...crawlingInfo };
        } catch {
          return;
        }
      }),
    );

    for (const shop of shoplist) {
      if (shop !== undefined) {
        result.push(shop);
      }
    }

    return result;
  }
}
