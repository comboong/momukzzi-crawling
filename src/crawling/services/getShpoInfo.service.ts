import { BadRequestException, Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { checkMenuClassName } from './checkMenuClassName.service';
import { throwError } from 'rxjs';

@Injectable()
export class GetShopInfoService {
  async crawShopInfo(
    shopUrl: string,
  ): Promise<{ menuInfo: [string, number][]; menuImgUrl: string[] }> {
    const browser = await puppeteer.launch({ headless: true });

    try {
      // 새로운 페이지 열기
      const page = await browser.newPage();

      // 웹 페이지로 이동
      await page.goto(shopUrl, {
        waitUntil: 'networkidle0',
      });

      // 메뉴 정보 크롤링
      const webMenuList = await page.$$(
        '#mArticle > div.cont_menu > ul.list_menu > li',
      );

      const menuList: [string, number][] = [];
      const menuImg: string[] = [];

      for (const menu of webMenuList) {
        //class name 불일치로 인한 예외처리
        const classType = await menu.evaluate((el) => el.getAttribute('class'));
        const checkMenuClass = checkMenuClassName(classType); //classname이 일치하는지 여부 판단하는 함수
        if (!checkMenuClass) continue;
        //메뉴 이름
        const menuName = await menu.$eval(
          'div.info_menu > span.loss_word',
          (data) => data.textContent,
        );

        //메뉴 가격
        try {
          const menuPirce = await menu
            .$eval('div.info_menu > em.price_menu', (data) => data.textContent)
            .then((x) => Number(x.replace('가격: ', '').replace(',', '')));

          menuList.push([menuName, menuPirce]);
        } catch {
          menuList.push([menuName, null]);
        }
      }

      // 음식 사진 크롤링
      const src = await page.$$(
        '#mArticle > div.cont_photo > div.photo_area > ul > li',
      );

      for (const img of src) {
        const imageTag = await img.$('a');
        const el = await imageTag.evaluate((el) => {
          return el.getAttribute('style');
        });

        const urlMatch = el.match(/url\('(.+)'\)/);
        const imageUrl = urlMatch ? urlMatch[1] : null;

        if (imageUrl != null) {
          const match = imageUrl.match(/http.*/);
          const extractedUrl = match[0];
          const decodedUrl = decodeURIComponent(extractedUrl);
          menuImg.push(decodedUrl);
        }
      }

      return { menuInfo: menuList, menuImgUrl: menuImg };
    } catch (error) {
      console.log('오류 발생:', error);
      throw new BadRequestException();
    } finally {
      await browser.close();
    }
  }
}
