import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AppService {
  async getHello(): Promise<any> {
    const browser = await puppeteer.launch({ headless: true });

    try {
      // 새로운 페이지 열기
      const page = await browser.newPage();

      // 웹 페이지로 이동
      await page.goto('https://place.map.kakao.com/414107084', {
        waitUntil: 'networkidle0',
      });
      // 메뉴 정보 크롤링
      const webMenuList = await page.$$(
        '#mArticle > div.cont_menu > ul > li.nophoto_type',
      );

      const menuList: [string, number][] = [];
      for (const menu of webMenuList) {
        //메뉴 이름
        const menuName = await menu.$eval(
          'div.info_menu > span.loss_word',
          (data) => data.textContent,
        );

        //메뉴 가격
        const menuPirce = await menu
          .$eval('div.info_menu > em.price_menu', (data) => data.textContent)
          .then((x) => Number(x.replace('가격: ', '').replace(',', '')));

        menuList.push([menuName, menuPirce]);
      }

      console.log(menuList);

      // 음식 사진 크롤링
      // await page.click('li.size_l');
      const src = await page.$$(
        '#mArticle > div.cont_photo > div.photo_area > ul > li',
      );

      for (const img of src) {
        const mm = await img.$('a');
        const el = await mm.evaluate((el) => {
          return el.getAttribute('style');
        });

        const urlMatch = el.match(/url\('(.+)'\)/);
        const imageUrl = urlMatch ? urlMatch[1] : null;
        console.log(imageUrl);
      }
      // const photoElements = await page.$$('.thumb_area .thumb_img');
      const photos = [];
      // for (const photoElement of photoElements) {
      //   const photoUrl = await photoElement.evaluate((element) => element.src);
      //   photos.push(photoUrl);
      // }

      console.log('음식 사진:', photos);
    } catch (error) {
      console.log('오류 발생:', error);
    } finally {
      // Puppeteer 브라우저 인스턴스 종료
      await browser.close();
    }
    return 'Hello World!';
  }
}
