const puppeteer = require('puppeteer');
const rand_url = "https://www.adidas.com.ph/ultraboost-21-shoes/FZ1921.html";


async function initBrowser(){
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });
    await page.goto(rand_url);
    return page;
}

async function addToCart(page){

    // const sizeButtonEls = await page.$$("button[class='gl-label size___TqqSo']");
    // const prefferedSize = '8';
    // for (let i = 0; i < sizeButtonEls.length; i++) {
    //     const sizeButtonValues = await sizeButtonEls[i].$eval('span', i => i.textContent);
    //     sizeButtonVal = sizeButtonValues.replace(" UK", "");
    //     if(sizeButtonVal == prefferedSize){
    //         console.log(sizeButtonVal);
    //         // await page.$eval("button[class='gl-label size___TqqSo']", elem => elem.click()).toBe(prefferedSize);
    //         await page.$eval("button[class='gl-label size___TqqSo']", elem => elem.click());      
    //     }
    // }

    await page.$eval("button[class='gl-label size___TqqSo']", elem => elem.click());
    await page.waitFor(2000);
    await page.$eval("button[class='gl-cta gl-cta--primary gl-cta--full-width']", elem => elem.click());
    await page.waitFor(2000);
    await page.$eval("a[class='gl-cta gl-cta--secondary gl-cta--full-width gl-vspace']", elem => elem.click());
    await page.waitFor(2000);
}

async function deliveryPage(page){
    await page.type("input[id='dwfrm_shipping_shiptoaddress_shippingAddress_firstName'", "Lidel Kim");
    await page.waitFor(2000);
    await page.type("input[id='dwfrm_shipping_shiptoaddress_shippingAddress_lastName'", "Daddie");
    await page.waitFor(2000);
    await page.type("input[id='dwfrm_shipping_shiptoaddress_shippingAddress_address1'", "49a Diamond Street Pag-Ibig Heights Catalunan Grande");
    await page.waitFor(2000);
    await page.type("input[id='dwfrm_shipping_shiptoaddress_shippingAddress_address2'", "49a Diamond Street Pag-Ibig Heights Catalunan Grande");
    await page.waitFor(2000);
    await page.type("input[id='dwfrm_shipping_shiptoaddress_shippingAddress_address3'", "Catalunan Grande");
    await page.waitFor(2000);


    await page.type("input[id='dwfrm_shipping_shiptoaddress_shippingAddress_countyProvince'", "Davao Del Sur");
    await page.waitFor(2000);

    await page.type("input[id='dwfrm_shipping_shiptoaddress_shippingAddress_city'", "DAVAO CITY");
    await page.waitFor(2000);

    await page.type("input[id='dwfrm_shipping_shiptoaddress_shippingAddress_postalCode'", "8000");
    await page.waitFor(2000);

    // await page.select("div[id='dwfrm_shipping_shiptoaddress_shippingAddress_countyProvince']", 'pizza', 'donut', 'bonda')
    // await page.select("div[class='']", 'pizza', 'donut', 'bonda')
    // await page.select("div[class='materialize-element-field dwfrm_shipping_shiptoaddress_shippingAddress_postalCode_d0istqmrepjj ng-binding']", 'pizza', 'donut', 'bonda')

    await page.type("input[id='dwfrm_shipping_shiptoaddress_shippingAddress_phone'", "Lidel Kim");
    await page.waitFor(2000);
    await page.type("input[id='materialize-element-field dwfrm_shipping_shiptoaddress_shippingAddress_city_d0ezgmvlsjpc ng-binding'", "Lidel Kim");
    await page.waitFor(2000);
    await page.type("input[id='dwfrm_shipping_codiceFiscale_codiceFiscale'", "Lidel Kim");
    await page.waitFor(2000);

    await page.$eval("button[class='gl-cta gl-cta--primary']", elem => elem.click());
    await page.waitFor(2000);
}

async function checkout(){
    const page = await initBrowser();
    await addToCart(page);
    await deliveryPage(page);
}

checkout();