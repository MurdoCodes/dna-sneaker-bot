const supreme = require("./shop/supreme");


// CATEGORIES > jackets, shirts, sweatshirts, tops-sweaters, pants, shorts, hats, bags, accessories, shoes, skate
// const preferredCategoryName = "jackets";
// const preferredTitle = "Supreme®/The North Face® Summit Series Outer Tape Seam Jacket";
// const prefferedTitle = "Eagle Hooded Work Jacket";

// const preferredCategoryName = "accessories";
// const preferredTitle = "Supreme®/Hanes® Tagless Tank Tops (3 Pack)";

// const preferredCategoryName = "skate";
// const preferredTitle = "Supreme®/Spitfire® Classic Wheels(Set of 4)";

const userBotData = {
    bot1 : {
        preferredCategoryName : "accessories",
        preferredTitle : "Supreme®/Hanes® Tagless Tank Tops (3 Pack)",
        preferredColor : "Black", 
        preferredSize : "XLarge", 
        preferredQuantity : "4", 
        preferredBillingName : "Test Two", 
        preferredOrder_email : "testtwo@testtwo.com", 
        preferredOrder_number : "123 456 789 0", 
        preferredOrder_billing_address : "2181 PO BOX", 
        preferredOrder_billing_city : "ALABASTER", 
        preferredOrder_billing_zip : "35007-2024", 
        preferredOrder_billing_state : "AL", 
        preferredCreditCardNumber : "12312321321312321312", 
        preferredCcnMonth : "10", 
        preferredCcnYear : "2031", 
        preferredCcnCVV : "123",
        preferredProxyServer : '208.80.28.208:8080'
    },
    bot2 : {           
        preferredCategoryName : "jackets",
        preferredTitle : "Eagle Hooded Work Jacket",
        preferredColor : "Black", 
        preferredSize : "Medium", 
        preferredQuantity : "4", 
        preferredBillingName : "Test One", 
        preferredOrder_email : "testone@testone.com", 
        preferredOrder_number : "123 456 789 0", 
        preferredOrder_billing_address : "2181 PO BOX", 
        preferredOrder_billing_city : "ALABASTER", 
        preferredOrder_billing_zip : "35007-2024", 
        preferredOrder_billing_state : "AL", 
        preferredCreditCardNumber : "12312321321312321312", 
        preferredCcnMonth : "10", 
        preferredCcnYear : "2031", 
        preferredCcnCVV : "123",
        preferredProxyServer : '216.21.18.193:80'
    }    ,
    bot3 : {
        preferredCategoryName : "skate",
        preferredTitle : "Supreme®/Spitfire® Classic Wheels(Set of 4)",
        preferredColor : "Black", 
        preferredSize : "XLarge", 
        preferredQuantity : "4", 
        preferredBillingName : "Test Three", 
        preferredOrder_email : "testthree@testthree.com", 
        preferredOrder_number : "123 456 789 0", 
        preferredOrder_billing_address : "2181 PO BOX", 
        preferredOrder_billing_city : "ALABASTER", 
        preferredOrder_billing_zip : "35007-2024", 
        preferredOrder_billing_state : "AL", 
        preferredCreditCardNumber : "12312321321312321312", 
        preferredCcnMonth : "10", 
        preferredCcnYear : "2031", 
        preferredCcnCVV : "123",
        preferredProxyServer : '216.21.18.194:80'
    },
    bot4 : {
        preferredCategoryName : "jackets",
        preferredTitle : "Barn Coat",
        preferredColor : "Black", 
        preferredSize : "XLarge", 
        preferredQuantity : "4", 
        preferredBillingName : "Test Three", 
        preferredOrder_email : "testthree@testthree.com", 
        preferredOrder_number : "123 456 789 0", 
        preferredOrder_billing_address : "2181 PO BOX", 
        preferredOrder_billing_city : "ALABASTER", 
        preferredOrder_billing_zip : "35007-2024", 
        preferredOrder_billing_state : "AL", 
        preferredCreditCardNumber : "12312321321312321312", 
        preferredCcnMonth : "10", 
        preferredCcnYear : "2031", 
        preferredCcnCVV : "123",
        preferredProxyServer : '216.21.18.194:80'
    }

}

for(var counter in userBotData){        
    supreme.checkout(userBotData[counter]);
}