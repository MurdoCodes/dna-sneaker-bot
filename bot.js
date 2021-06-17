const {app, BrowserWindow, ipcMain, Menu, Notification } = require('electron')
const dotenv = require('dotenv').config();
const mysql = require('mysql');
const path = require('path')
const supreme = require("./shop/supreme");

function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false
        }
    });
    mainWindow.maximize();

    // and load the index.html of the app.
    mainWindow.loadFile('./src/html/index.html');
    // Menu
    const template = [];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}

// Once our app is ready, we create an window and load index.html
app.whenReady().then(() => {
    createWindow();  
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// CATEGORIES > jackets, shirts, sweatshirts, tops-sweaters, pants, shorts, hats, bags, accessories, shoes, skate
const userBotData = {
    bot1 : {
        preferredCategoryName : "accessories",
        // preferredTitle : "Supreme®/Hanes® Tagless Tank Tops (3 Pack)",
        preferredTitle : "Supreme®/Emilio Pucci® Cat Sunglasses",
        preferredColor : "White", 
        preferredSize : "Small", 
        preferredQuantity : "1", 
        preferredBillingName : "Test Two", 
        preferredOrder_email : "testtwo@testtwo.com", 
        preferredOrder_number : "1234567899", 
        preferredOrder_billing_address : "1953 Municipal Way", 
        preferredOrder_billing_city : "ALABASTER", 
        preferredOrder_billing_zip : "35007-2024", 
        preferredOrder_billing_state : "AL", 
        preferredCreditCardNumber : "378282246310005", 
        preferredCcnMonth : "10", 
        preferredCcnYear : "2031", 
        preferredCcnCVV : "123",
        preferredProxyServer : '23.109.55.108:10000'
    }
    // ,
    // bot2 : {           
    //     preferredCategoryName : "jackets",
    //     preferredTitle : "Eagle Hooded Work Jacket",
    //     preferredColor : "Black", 
    //     preferredSize : "Medium", 
    //     preferredQuantity : "4", 
    //     preferredBillingName : "Test One", 
    //     preferredOrder_email : "testone@testone.com", 
    //     preferredOrder_number : "123 456 789 0", 
    //     preferredOrder_billing_address : "2181 PO BOX", 
    //     preferredOrder_billing_city : "ALABASTER", 
    //     preferredOrder_billing_zip : "35007-2024", 
    //     preferredOrder_billing_state : "AL", 
    //     preferredCreditCardNumber : "371449635398431", 
    //     preferredCcnMonth : "10", 
    //     preferredCcnYear : "2031", 
    //     preferredCcnCVV : "123",
    //     preferredProxyServer : '216.21.18.193:80'
    // }    ,
    // bot3 : {
    //     preferredCategoryName : "skate",
    //     preferredTitle : "Supreme®/Spitfire® Classic Wheels(Set of 4)",
    //     preferredColor : "Black", 
    //     preferredSize : "XLarge", 
    //     preferredQuantity : "4", 
    //     preferredBillingName : "Test Three", 
    //     preferredOrder_email : "testthree@testthree.com", 
    //     preferredOrder_number : "123 456 789 0", 
    //     preferredOrder_billing_address : "2181 PO BOX", 
    //     preferredOrder_billing_city : "ALABASTER", 
    //     preferredOrder_billing_zip : "35007-2024", 
    //     preferredOrder_billing_state : "AL", 
    //     preferredCreditCardNumber : "378734493671000", 
    //     preferredCcnMonth : "10", 
    //     preferredCcnYear : "2031", 
    //     preferredCcnCVV : "123",
    //     preferredProxyServer : '216.21.18.194:80'
    // },
    // bot4 : {
    //     preferredCategoryName : "jackets",
    //     preferredTitle : "Barn Coat",
    //     preferredColor : "Black", 
    //     preferredSize : "XLarge", 
    //     preferredQuantity : "4", 
    //     preferredBillingName : "Test Three", 
    //     preferredOrder_email : "testthree@testthree.com", 
    //     preferredOrder_number : "123 456 789 0", 
    //     preferredOrder_billing_address : "2181 PO BOX", 
    //     preferredOrder_billing_city : "ALABASTER", 
    //     preferredOrder_billing_zip : "35007-2024", 
    //     preferredOrder_billing_state : "AL", 
    //     preferredCreditCardNumber : "4111111111111111", 
    //     preferredCcnMonth : "10", 
    //     preferredCcnYear : "2031", 
    //     preferredCcnCVV : "123",
    //     preferredProxyServer : '216.21.18.194:80'
    // }

}

// for(var counter in userBotData){        
//     supreme.checkout(userBotData[counter]);
// }

