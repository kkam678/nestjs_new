import {Injectable, Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import * as puppeteer from 'puppeteer';

@Injectable()
export class InstagramService {
    private readonly logger = new Logger(InstagramService.name);

    // @Cron('* * * * * *', {name: 'cronTask'})
    // handleCron() {
    //     this.logger.log('TaskCalled');
    // }

    async getInstagram() {
        // const browser = await puppeteer.launch({
        //     headless: false,
        // })
        // const page = await browser.newPage()
        // await page.goto('https://instagram.com',{
        //     waitUntil: 'networkidle2',
        // });
        // console.log('aaaaaaaaaaa');
        // const result = await page.evaluate(() => {
        //     console.log('aaaaaaaaaaa');
        //     return "aaaaa";
        // });
        // console.log(result);
        const browser = await puppeteer.launch({
            // headless: false,
            args: ["--window-size=1920,1080", "--no-sandbox"],

            // userDataDir: "C:\\Users\\ms\\AppData\\Local\\Google\\Chrome\\User Data",
        })
        const page = await browser.newPage()
        await page.goto('https://www.instagram.com/');
        await page.waitForTimeout(1000);
        await page.type('input[name=username]', 'livek8888@gmail.com');
        await page.type('input[name=password]', 'livek12!@');
        await page.click('button[type=submit]');
        await page.waitForNavigation();
        console.log('New Page URL:', page.url());
        if (page.url() === 'https://www.instagram.com/accounts/onetap/?next=%2F') {
            await page.click('button[type=button]');
            await page.waitForNavigation();
        }
        await page.goto('https://www.instagram.com/bmw');
        const result = await page.evaluate(() => {
            let listItems = [];
            // document.querySelector('a._9VEo1').
            const listRow = document.querySelectorAll('.Nnq7C');
            listRow.forEach((v,k) => {
                const col = v.querySelectorAll('.v1Nh3');
                col.forEach((vv,kk) => {
                    const href = vv.querySelector('a').getAttribute('href');
                    const img = vv.querySelector('.eLAPa .KL4Bh img')
                    const imgAlt = img.getAttribute('alt');
                    const imgSrc = img.getAttribute('src');
                    const isMulti = vv.querySelector('a .CzVzU') !== undefined;
                    listItems.push({
                        href: href,
                        imgAlt: imgAlt,
                        imgSrc: imgSrc,
                        isMulti: isMulti,
                    });
                })
            })
            return listItems;
        });
        console.log(result);
        // await page.close()
        // await browser.close()

    }
}