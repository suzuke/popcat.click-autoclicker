var puppeteer = require("puppeteer");
var userAgent = require('user-agents');
var pops = 0;
var openedBrowsers = 0;
(async() => {
    function runBrowser() {
        return new Promise(resolve => {
            (async() => {
                const browser = await puppeteer.launch({headless:true});
                try{
                    const page = await browser.newPage().catch(catchError);
                    await page.setUserAgent(userAgent.toString()).catch(catchError);
                    await page.goto('https://popcat.click/').catch(catchError);
                
                    async function pop(){
                        var sendedData = await page.evaluate(() => {
                            return new Promise(async resolve => {
                                await fetch(`https://stats.popcat.click/pop?pop_count=800&captcha_token=${await app.__vue__.$recaptcha("pop")}`, {method: "POST"}).then(response => {
                                    resolve({status: response.status, count: 800})
                                })
                            })
                        });
                        if(sendedData.status == 201){
                            console.log(`Sended ${sendedData.count} pops.`);
                            pops += sendedData.count
                        }else if(sendedData.status == 429){
                            console.log("Too many requests! Make sure you don't have https://popcat.click or this app already running on your network.")
                        }else{
                            console.log(`Error! Popcat server response: ${sendedData.status}`)
                        }
                    }
                    
                    await pop()
                    var interval = setInterval(async () => {
                        await pop()
                    }, 1000 * 30);
                    function catchError(){
                        clearInterval(interval)
                        browser.close()
                        resolve()
                    }
                }catch(err){
                    clearInterval(interval)
                    browser.close()
                    resolve()
                }
            })();
        })
    }
    
    setInterval(() => {
        if(openedBrowsers < 1){
            openedBrowsers++
            runBrowser().then(() => {
                openedBrowsers--
            })
        }
    }, 200);
})();

setInterval(() => {
    console.log("Pops: " + pops);
    console.log("Opened Browsers: " + openedBrowsers)
}, 1000);