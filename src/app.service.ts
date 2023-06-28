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
      const menuElements = await page.$$eval(
        '#mArticle > div.cont_menu > ul > li.nophoto_type',
        (options) => {
          return options.map((option) => option.innerText);
        },
      );
      const aa = await page.$$(
        '#mArticle > div.cont_menu > ul > li.nophoto_type',
      );

      const bb = await aa[0].$eval(
        'div.info_menu > em.price_menu',
        (data) => data.textContent,
      );

      const cc = Number(bb.replace('가격: ', '').replace(',', ''));

      console.log(cc);

      // console.log(menuElements);
      console
        .log
        // await aa[0].$eval(
        //   'div.info_menu > span.loss_word',
        //   (data) => data.textContent,
        // ),

        // await aa[0]
        //   .$eval('div.info_menu > em.price_menu', (data) => data.textContent)
        //   .then((a) => {
        //     return a.replace('가격 : ', '');
        //   }),
        ();
      const menus = [];
      // for (const menuElement of menuElements) {
      //   const menuName = await menuElement.$eval(
      //     '.loss_word',
      //     (element) => element.textContent,
      //   );
      //   const menuPrice = await menuElement.$eval(
      //     '.price',
      //     (element) => element.textContent,
      //   );
      //   menus.push({ name: menuName, price: menuPrice });
      // }
      console.log('메뉴 정보:', menus);

      // 음식 사진 크롤링
      const photoElements = await page.$$('.thumb_area .thumb_img');
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
