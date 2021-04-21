var puppeteer = require("puppeteer");
var userAgent = require('user-agents');

return new Promise(async resolve => {
    console.log("Starting test")
    const browser = await puppeteer.launch({headless:true});
    try{
        const page = await browser.newPage().catch(catchError);
        await page.setUserAgent(userAgent.toString()).catch(catchError);
        await page.goto('https://popcat.click/').catch(catchError);
    
        var sendedData = await page.evaluate(() => {
            return new Promise(async resolve => {
                await fetch(`https://stats.popcat.click/pop?pop_count=799&captcha_token=${await app.__vue__.$recaptcha("pop")}`, {method: "POST"}).then(response => {
                    resolve({status: response.status, count: 799})
                })
            })
        });
        console.log("Status code: " + sendedData.status);
        resolve("Status code: " + sendedData.status)
        process.exit("Status code: " + sendedData.status)
        
        function catchError(error){
            resolve(error)
        }
    }catch(error){
        resolve(new Error(error))
    }
})
