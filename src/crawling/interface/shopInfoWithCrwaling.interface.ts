import { ShopInfo } from './shopInfo.interface';

export interface shopInfoWithCrawling extends ShopInfo {
  menuInfo: [string, number][];
  menuImgUrl: string[];
}

export interface CrawedShopInfo {
  menuInfo: [string, number][];
  menuImgUrl: string[];
}
