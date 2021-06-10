// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
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
    })
    mainWindow.maximize()
  
    // and load the index.html of the app.
    mainWindow.loadFile('./src/html/index.html')
  
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
  }
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    createWindow()
    
    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
  


// CATEGORIES > jackets, shirts, sweatshirts, tops-sweaters, pants, shorts, hats, bags, accessories, shoes, skate
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

// for(var counter in userBotData){        
//     supreme.checkout(userBotData[counter]);
// }