const puppeteer = require('puppeteer');

// Global Variables
const rand_url = "https://www.supremenewyork.com/shop/all";
// CATEGORIES > jackets, shirts, sweatshirts, tops-sweaters, pants, shorts, hats, bags, accessories, shoes, skate
const preferredCategoryName = "jackets"; 
const prefferedTitle = "Supreme®/The North Face® Summit Series Outer Tape Seam Jacket";
const prefferedColor = "Black";
const prefferedSize = "Large";
const prefferedQuantity = "4";


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

// Remove sold out items
async function removeSoldOutProduct(page){

    let itemSoldOut = ".sold_out_tag";

    await page.evaluate((itemSoldOut) => {
        var elements = document.querySelectorAll(itemSoldOut);
        for(var i=0; i< elements.length; i++){
            elements[i].parentNode.parentNode.parentNode.removeChild(elements[i].parentNode.parentNode);
        }
    }, itemSoldOut);

    await page.waitForTimeout(1000);
    selectAvailProdByCategory(page);
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

    await page.waitForTimeout(1000);

}

// Select Product by Product Name in a Category
async function selectProdNameCat(page){

    await page.waitForSelector('h1[itemprop="name"]', {visible: true})
    let titleElement = await page.$('h1[itemprop="name"]');
    let itemTitle = await page.evaluate(el => el.textContent, titleElement);

    await page.waitForTimeout(1000);
    console.log(prefferedTitle);
    if( prefferedTitle == itemTitle){
        addToCart(page);
    }else{
        await page.$eval("a[class='next']", elem => elem.click()); // color picker
        await page.waitForTimeout(1500);
        selectProdNameCat(page);
    }

}

// Bot on Add To Cart Page
async function addToCart(page){
    // Black Sizes > 85615, 85616, 85617, 85618
    // Pink Sizes > 85611, 85612, 85613, 85614

    // Check if color option exist
    if (await page.$("a[data-style-name='"+prefferedColor+"']#size") !== null){
        await page.$eval("a[data-style-name='"+prefferedColor+"']", elem => elem.click()); // color picker
        await page.waitForTimeout(1500);
    }

    // Check if sizes Exist
    if (await page.$("select#size") !== null) {
        await page.select("select#size", prefferedSize); // size select
        await page.waitForTimeout(1500);
    }

    // Check if Quantity Exist
    if (await page.$("select#qty") !== null) {
        await page.select("select#size", prefferedQuantity); // size select
        await page.waitForTimeout(1500);
    }

    

    await page.$eval("input[type='submit']", elem => elem.click()); // add to cart button
    await page.waitForTimeout(1500);

    await page.$eval("a[class='button checkout']", elem => elem.click()); // checkout button
    await page.waitForTimeout(1500);
    deliveryPage(page);
}

// Bot on Delivery Page
async function deliveryPage(page){
    const creditCardNumber = "12312321321312321312";
    const ccnMonth = "10";
    const ccnYear = "2031";
    const ccnCVV = "123";

    await page.type("input[id='order_billing_name'", "Lidel Kim Daddie"); // Write Full Name
    await page.waitForTimeout(1500);

    await page.type("input[id='order_email'", "test@test.com"); // Write Email
    await page.waitForTimeout(1500);

    await page.type("input[id='order_tel'", "+123 456 789 0"); // Write Phone Number
    await page.waitForTimeout(1500);

    await page.type("input[id='order_billing_zip'", "8000"); // Write Zip Code
    await page.waitForTimeout(1500);

    await page.select("select#order_billing_state", " 青森県"); // Select State
    await page.waitForTimeout(1500);

    await page.type("input[id='order_billing_city'", "Davao City"); // Write City
    await page.waitForTimeout(1500);

    await page.type("input[id='order_billing_address'", "49a Diamon Street Pag-Ibig Heights"); // Write Address
    await page.waitForTimeout(1500);

    const store_address = await page.$('input[id="store_address"]');
    console.log(await (await store_address.getProperty('checked')).jsonValue());
    await store_address.click(); // Check Store Address Checkbox

    await page.select("select#credit_card_type", "visa"); // Select Credit Card Type > visa, american_express, master, jcb, cod
    await page.waitForTimeout(1500);

    await page.type("input[id='cnb'", creditCardNumber); // Write Credit Card Number
    await page.waitForTimeout(1500);

    await page.select("select#credit_card_month", ccnMonth); // Select Month
    await page.waitForTimeout(1500);

    await page.select("select#credit_card_year", ccnYear); // Select Year
    await page.waitForTimeout(1500);

    await page.type("input[id='vval'", ccnCVV); // Write Credit Card CVV
    await page.waitForTimeout(1500);
    
    const order_terms = await page.$('input[id="order_terms"]');
    console.log(await (await order_terms.getProperty('checked')).jsonValue());
    await order_terms.click(); // Check Order Terms

    await page.$eval("input[class='button checkout']", elem => elem.click()); // checkout button
    await page.waitForTimeout(1500);
}

async function checkout(){
    const page = await initBrowser();
    await removeSoldOutProduct(page);
}

// module.exports = checkout;
module.exports.checkout = checkout;