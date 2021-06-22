async function initDb(mysql, NOTIFICATION_ICON){
    var conn = mysql.createConnection({
        host: process.env.dbHost,
        user: process.env.dbUser, 
        password: process.env.dbPass,
        database: process.env.dbName
    });
    await conn.connect((err) => {
        if(err) return console.log(err.stack);
        const NOTIFICATION_TITLE = 'DNA ShoeBot';
        const NOTIFICATION_BODY = `App is now ready to use!`;
        new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY, icon: NOTIFICATION_ICON });
    });

    return conn;
}

module.exports = initDb;