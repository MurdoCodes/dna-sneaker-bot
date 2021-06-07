const puppeteer = require('puppeteer');
const useProxy = require('puppeteer-page-proxy');

// Global Variables
const rand_url = "https://www.supremenewyork.com/shop/all";
// const rand_url = "https://whatismyipaddress.com/";
let preferredCategoryName = "";
let preferredTitle = "";
let preferredColor = "";
let preferredSize = "";
let preferredQuantity = "";
let preferredBillingName = "";
let preferredOrder_email = "";
let preferredOrder_number = "";
let preferredOrder_billing_address = "";
let preferredOrder_billing_city = "";
let preferredOrder_billing_zip = "";
let preferredOrder_billing_state = "";
let preferredCreditCardNumber = "";
let preferredCcnMonth = "";
let preferredCcnYear = "";
let preferredCcnCVV = "";
let preferredProxyServer = "";


async function initBrowser(preferredProxyServer){
    const proxyServer = '--proxy-server=' + preferredProxyServer;

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreHTTPSErrors: true
        // args: [ proxyServer ]
    });
    const page = await browser.newPage();    
    // Set page viewport
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1, });
    // Close unused page
    const pages = await browser.pages();
    if (pages.length > 1) {
        await pages[0].close();
    }
    // Got to url
    await page.setDefaultNavigationTimeout(0);
    await page.goto(rand_url);
    return page;
}

async function checkout(userBot){
    for(var counter in userBot){
        preferredCategoryName = userBot[counter]["preferredCategoryName"];
        preferredTitle = userBot[counter]["preferredTitle"];
        preferredColor = userBot[counter]["preferredColor"];
        preferredSize = userBot[counter]["preferredSize"];
        preferredQuantity = userBot[counter]["preferredQuantity"];
        preferredBillingName = userBot[counter]["preferredBillingName"];
        preferredOrder_email = userBot[counter]["preferredOrder_email"];
        preferredOrder_number = userBot[counter]["preferredOrder_number"];
        preferredOrder_billing_address = userBot[counter]["preferredOrder_billing_address"];
        preferredOrder_billing_city = userBot[counter]["preferredOrder_billing_city"];
        preferredOrder_billing_zip = userBot[counter]["preferredOrder_billing_zip"];
        preferredOrder_billing_state = userBot[counter]["preferredOrder_billing_state"];
        preferredCreditCardNumber = userBot[counter]["preferredCreditCardNumber"];
        preferredCcnMonth = userBot[counter]["preferredCcnMonth"];
        preferredCcnYear = userBot[counter]["preferredCcnYear"];
        preferredCcnCVV = userBot[counter]["preferredCcnCVV"];
        preferredProxyServer = userBot[counter]["preferredProxyServer"];

        const pagecounter = await initBrowser(preferredProxyServer);
        await removeSoldOutProduct(pagecounter);
        await selectAvailProdByCategory(pagecounter);
        selectProdNameCat(pagecounter, userBot[counter]);
    }
    
}

module.exports = checkout;
module.exports.checkout = checkout;

// Remove sold out items
async function removeSoldOutProduct(page){

    let itemSoldOut = ".sold_out_tag";

    await page.evaluate((itemSoldOut) => {
        var elements = document.querySelectorAll(itemSoldOut);
        for(var i=0; i< elements.length; i++){
            elements[i].parentNode.parentNode.parentNode.removeChild(elements[i].parentNode.parentNode);
        }
    }, itemSoldOut);    
}

// Select Available Product By Category
async function selectAvailProdByCategory(page){

    let itemAvailable = ".inner-article";

    await page.evaluate((itemAvailable, preferredCategoryName) => {        
        var elements = document.querySelectorAll(itemAvailable); 
        for(var i=0; i< elements.length; i++){
            const url = elements[i].children[0].getAttribute('href');
            if(url.includes(preferredCategoryName)){
                elements[i].children[0].click();
            }            
        }
    }, itemAvailable, preferredCategoryName);
}

// Select Product by Product Name in a Category
async function selectProdNameCat(page, data){
    console.log(data);
    preferredTitle1 = data["preferredTitle"];
    await page.waitForSelector('h1[itemprop="name"]', {visible: true})
    let titleElement = await page.$('h1[itemprop="name"]');
    let itemTitle = await page.evaluate(el => el.textContent, titleElement);
    await page.waitForTimeout(1000);

    console.log(preferredTitle1 + " = " + itemTitle);

    if( preferredTitle1 == itemTitle ){
        addToCart(page, data);
    }else{
        await page.$eval("a[class='next']", elem => elem.click()); // color picker
        await page.waitForTimeout(1500);
        selectProdNameCat(page);
    }

}

// Bot on Add To Cart Page
async function addToCart(page, data){
    // If color option exist
    prefferedColor = data["preferredColor"];
    const colorElement = await page.evaluate((preferredColor) => {
        const element = document.querySelector("a[data-style-name='"+preferredColor+"']");        
        return element;
    }, preferredColor);
    if(colorElement !== null){
        await page.$eval("a[data-style-name='"+preferredColor+"']", elem => elem.click()); // color picker
    }

    // If sizes Exist
    preferredSize = data["preferredSize"];
    const sizeElement = await page.evaluate(() => {
        const element = document.querySelector('select#size');        
        return element;
    });
    if(sizeElement !== null){
        let $elemHandler = await page.$('select#size');
        let properties = await $elemHandler.getProperties();
        for (const property of properties.values()) {
            const element = property.asElement();
            if (element){
                let hText = await element.getProperty("text");
                let text = await hText.jsonValue();
                if(text===preferredSize){
                    let hValue = await element.getProperty("value");
                    let value = await hValue.jsonValue();
                    await page.select("select#size",value);
                }
            }
        }
    }

    // If Quantity Exist
    preferredQuantity = data["preferredQuantity"];
    const qtyElement = await page.evaluate(() => {
        const element = document.querySelector('select#qty');        
        return element;
    });
    if(qtyElement !== null){
        await page.select("select#qty", preferredQuantity); // Quantity select
    }

    // If Add To Cart Button Exist
    const addToCartElement = await page.evaluate(() => {
        const element = document.querySelector("input[type='submit']");        
        return element;
    });
    if(addToCartElement !== null){
        await page.$eval("input[type='submit']", elem => elem.click()); // add to cart button
        await page.waitForTimeout(1500);
        await page.$eval("a[class='button checkout']", elem => elem.click()); // checkout button
        await page.waitForTimeout(5000);
        checkoutFormPage(page, data); // Proceed to filling out checkout form
    }else{
        page.close();
    }
}

// Bot on Delivery Page
async function checkoutFormPage(page, data){
    console.log(data);
    preferredBillingName = data["preferredBillingName"];
    preferredOrder_email = data["preferredOrder_email"];
    preferredOrder_number = data["preferredOrder_number"];
    preferredOrder_billing_address = data["preferredOrder_billing_address"];
    preferredOrder_billing_zip = data["preferredOrder_billing_zip"];
    preferredOrder_billing_city = data["preferredOrder_billing_city"];
    preferredOrder_billing_state = data["preferredOrder_billing_state"];
    preferredCreditCardNumber = data["preferredCreditCardNumber"];
    preferredCcnMonth = data["preferredCcnMonth"];
    preferredCcnYear = data["preferredCcnYear"];
    preferredCcnCVV = data["preferredCcnCVV"];


    await page.type("input[id='order_billing_name']", preferredBillingName); // Write Full Name
    await page.waitForTimeout(1500);

    await page.type("input[id='order_email']", preferredOrder_email); // Write Email
    await page.waitForTimeout(1500);

    await page.type("input[id='order_tel']", preferredOrder_number); // Write Phone Number
    await page.waitForTimeout(1500);

    await page.type('input[name="order[billing_address]"]', preferredOrder_billing_address); // Write Address
    await page.waitForTimeout(1500);

    await page.type("input[id='order_billing_zip']", preferredOrder_billing_zip); // Write Zip Code
    await page.waitForTimeout(1500);

    const order_billing_city = await page.evaluate(() => {
        const element = document.querySelector("input[id='order_billing_city']");        
        return element;
    });
    if(order_billing_city !== null){
        await page.type("input[id='order_billing_city']", preferredOrder_billing_city); // Write City
        await page.waitForTimeout(1500);
    }
    
    const order_billing_state = await page.evaluate(() => {
        const element = document.querySelector("select#order_billing_state");        
        return element;
    });
    if(order_billing_state !== null){
        await page.select("select#order_billing_state", preferredOrder_billing_state); // Select State
        await page.waitForTimeout(1500);
    }   

    /* Save address for future use | not usefull
        const store_address = await page.$('input[id="store_address"]');
        console.log(await (await store_address.getProperty('checked')).jsonValue());
        await store_address.click(); // Check Store Address Checkbox
    */

    // await page.select("select#credit_card_type", "Credit Card"); // Select Credit Card Type > visa, american_express, master, jcb, cod
    // await page.waitForTimeout(1500);

    await page.type("input[id='cnb']", preferredCreditCardNumber); // Write Credit Card Number
    await page.waitForTimeout(1500);

    await page.select("select#credit_card_month", preferredCcnMonth); // Select Month
    await page.waitForTimeout(1500);

    await page.select("select#credit_card_year", preferredCcnYear); // Select Year
    await page.waitForTimeout(1500);

    await page.type("input[id='vval']", preferredCcnCVV); // Write Credit Card CVV
    await page.waitForTimeout(1500);
    
    const order_terms = await page.$('input[id="order_terms"]');
    console.log(await (await order_terms.getProperty('checked')).jsonValue());
    await order_terms.click(); // Check Order Terms

    await page.$eval("input[class='button checkout']", elem => elem.click()); // checkout button
    await page.waitForTimeout(1500);

    // Final step re captcha solver
}