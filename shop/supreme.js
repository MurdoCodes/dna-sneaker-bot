const puppeteer = require('puppeteer');
const ac = require('@antiadmin/anticaptchaofficial');

ac.setAPIKey(process.env.anticaptchaAPIKey);
ac.getBalance()
    .then(balance => console.log('my balance is: ' + balance))
    .catch(error => console.log("an error with API key: " + error));

// The function being called on the bot.js to trigger all functions
async function checkout(userBotData){ 
    console.log("Checkout Called For : " + userBotData["preferredTitle"]);         
    const page = await initBrowser(userBotData);   
}
module.exports = checkout;
module.exports.checkout = checkout;

async function initBrowser(userBotData){
    const url = process.env.randomUrl + userBotData["preferredCategoryName"];
    let preferredProxyServer = userBotData["preferredProxyServer"];
    const args = [
        '--proxy-server=socks5://'+preferredProxyServer,
    ];
    const options = {      
        headless: false,
        ignoreHTTPSErrors: true,
        args
    };
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    const pages = await browser.pages(); if (pages.length > 1) { await pages[0].close(); } // Close unused page    
    await page.setViewport({ width: 1920, height: 912, deviceScaleFactor: 1, }); // Set page viewport
    page.setDefaultNavigationTimeout(0);
    page.setDefaultTimeout(0);
    await page.goto(url, {waitUntil: 'load', timeout: 0}); // randomUrl1 || randomUrl2 Got to url
    await removeSoldOutProduct(page, userBotData); // Remove Sold out function
    // return page;    
}

// Remove sold out items function
async function removeSoldOutProduct(page, userBotData){
    let itemSoldOut = ".sold_out_tag";
    await page.evaluate((itemSoldOut) => {
        var elements = document.querySelectorAll(itemSoldOut);
        for(var i=0; i< elements.length; i++){ 
            elements[i].parentNode.parentNode.parentNode.removeChild(elements[i].parentNode.parentNode);
        }
    }, itemSoldOut);
    selectAvailProdByCategory(page, userBotData); // Proceed to function
}

// Select Available Product By Category
async function selectAvailProdByCategory(page, userBotData){
    let preferredCategoryName = userBotData["preferredCategoryName"];
    let preferredTitle = userBotData["preferredTitle"];
    const option = (await page.$x(
        '//*[@class = "name-link"][text() = "'+preferredTitle+'"]'
    ))[0];    
    if(option){        
        console.log("Item Available!");
        option.click();
        await page.waitForSelector('[itemprop="name"]');
        selectProdNameCat(page, userBotData);
    }else{
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

        await page.waitForSelector('[itemprop="name"]');
        selectProdNameCat(page, userBotData);
        // page.close();
    }    
}

// Select Product by Product Name in a Category
async function selectProdNameCat(page, userBotData){

    let preferredTitle = userBotData["preferredTitle"];
    let titleElement = await page.$('[itemprop="name"]');
    let itemTitle = await page.evaluate(el => el.textContent, titleElement);
    if( preferredTitle == itemTitle ){
        console.log("TRUE : " + preferredTitle + " = " + itemTitle);
        addToCart(page, userBotData);
    }else{
        console.log("FALSE : " + preferredTitle + " = " + itemTitle);
        await page.$eval("a[class='next']", elem => elem.click()); // color picker
        await page.waitForTimeout(1500);
        selectProdNameCat(page, userBotData);
    }
    console.log("**********************");
}

// Bot on Add To Cart Page
async function addToCart(page, userBotData){

    let preferredTitle = userBotData["preferredTitle"];
    let preferredColor = userBotData["preferredColor"];
    let preferredSize = userBotData["preferredSize"];
    let preferredQuantity = userBotData["preferredQuantity"];

    // Check if class sold-out exist
    const soldOut = await page.evaluate((soldOut) => {
        const element = document.querySelector("b.sold-out");
        console.log(element);
        if(!element){
            return false
        }else{
            return true;
        }
    });

    // If sold-out exist close browser return status
    if(soldOut === true){
        console.log(preferredTitle + " is already Sold Out! Stop Process!");
        page.close();        
    }else if(soldOut === false){
        // If sold-out does not exist continue checkout  
        console.log(preferredTitle + " is Available for Checkout! Continue Process!");              
        // If color option exist        
        const colorElement = await page.evaluate((preferredColor) => {
            const element = document.querySelector("a[data-style-name='"+preferredColor+"']");        
            return element;
        }, preferredColor);

        if(colorElement !== null){
            await page.$eval("a[data-style-name='"+preferredColor+"']", elem => elem.click()); // color picker
        }

        // If sizes Exist
        const sizeElement = await page.evaluate(() => {
            const element = document.querySelector('select#size');        
            return element;
        });
        if(sizeElement !== null){
            var options = await page.$$eval("select#size option", all => all.map(a => a.textContent))
            var option = options.includes(preferredSize);
            console.log(options);
            if(option === true){
                const option = (await page.$x(
                    '//*[@id = "size"]/option[text() = "'+preferredSize+'"]'
                ))[0];
                const value = await (await option.getProperty('value')).jsonValue();
                await page.select('#size', value);
            }else{
                console.log("Option does not exist");
            }            
        }

        // If Quantity Exist
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
            await page.waitForSelector("a[class='button checkout']", {visible: true});
            await page.$eval("a[class='button checkout']", elem => elem.click()); // checkout button
            try {
                await page.waitForSelector('input#order_billing_name');
                checkoutFormPage(page, userBotData); 
            } catch (e) {
                await page.waitForSelector('input#order_billing_name');
                checkoutFormPage(page, userBotData); 
                console.log('Element Does Not Exist');
            }
        }
    }
}

// Bot on Delivery Page
async function checkoutFormPage(page, userBotData){
    let preferredBillingName = userBotData["preferredBillingName"];
    let preferredOrder_email = userBotData["preferredOrder_email"];
    let preferredOrder_number = userBotData["preferredOrder_number"];
    let preferredOrder_billing_address = userBotData["preferredOrder_billing_address"];
    let preferredOrder_billing_city = userBotData["preferredOrder_billing_city"];
    let preferredOrder_billing_zip = userBotData["preferredOrder_billing_zip"];
    let preferredOrder_billing_state = userBotData["preferredOrder_billing_state"];
    let preferredCreditCardNumber = userBotData["preferredCreditCardNumber"];
    let preferredCcnMonth = userBotData["preferredCcnMonth"];
    let preferredCcnYear = userBotData["preferredCcnYear"];
    let preferredCcnCVV = userBotData["preferredCcnCVV"];

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

    await page.type("input[id='rnsnckrn']", preferredCreditCardNumber); // Write Credit Card Number
    await page.waitForTimeout(1500);

    await page.select("select#credit_card_month", preferredCcnMonth); // Select Month
    await page.waitForTimeout(1500);

    await page.select("select#credit_card_year", preferredCcnYear); // Select Year
    await page.waitForTimeout(1500);

    await page.type("input[id='orcer']", preferredCcnCVV); // Write Credit Card CVV
    await page.waitForTimeout(1500);
    
    const order_terms = await page.$('input[id="order_terms"]');
    console.log(await (await order_terms.getProperty('checked')).jsonValue());
    await order_terms.click(); // Check Order Terms

    await page.$eval("input[name='commit']", elem => elem.click()); // checkout button
    await page.waitForTimeout(1500);

    // Final step re captcha solver
    const captchaSiteKey = await page.evaluate(() => {
        const element = document.querySelector(".g-recaptcha");
        let attribute = element.getAttribute('data-sitekey');
        return attribute;
    });

    if(captchaSiteKey){

        let captchaResponseToken = await ac.solveRecaptchaV2Proxyless( page.url(), captchaSiteKey )
        .then(gresponse => {
            console.log('Solving ReCaptcha!')
            return gresponse;
        })
        .catch(error => 
            console.log('Error ReCaptcha Solving '+error)
        );

        if(captchaResponseToken){
            await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${captchaResponseToken}";`);
            console.log('ReCaptcha Solved! Finalizing Checkout!')
            page.evaluate(`document.getElementById("checkout_form").submit();`);
        }else{
            console.log("Invalid ReCaptcha");
        }  

    }
    
}
