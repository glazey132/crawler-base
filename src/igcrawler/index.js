//require packages needed for server, scraping and kue.
const express = require('express');
const path = require('path');
const axios = require('axios');
const kue = require('kue'),
  queue = kue.createQueue();
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

//initialize express server, set port and set kui ui port.
let app = express();
let port = 8080;
kue.app.listen(3000);

//this is the base url we will scrape
let baseUrl = 'https://instagram.com';

app.get('/', function(req, res) {
  res.json({ success: true, message: 'welcome to your webscraper' });
});

/*
//Route to get users profile userInfo
*/
app.get('/user_profile/:profileName', async function(req, res) {
  //get profile name from passed paramater in url
  let profileName = req.params.profileName;
  let uri = baseUrl + '/' + profileName;

  try {
    //launch puppeteer in headless mode to navigate to baseurl and begin scraping.
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    //set user agent to blend in.
    page.setUserAgent(
      'Mozilla/5.0, (Macintosh; Intel Max OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/67.0.3372.0 Safari/537.36'
    );

    //wait for navigator to be ready then navigate to uri.
    await page.evaluate('navigator.userAgent');
    const response = await page.goto(uri);

    const statusCode = response.status();

    //check if status is 404 (bad url). throw user doesnt exist error
    if (statusCode === 404) {
      res.json({
        user: null,
        error: `User: ${profileName} does not exist. Please wait 30 seconds and submit a valid username`
      });
    } else {
      //wait for the css content to be ready on page before scraping
      await page.waitForSelector('._6q-tv');

      let userInfo = [];

      //scrape relevant data
      const handle = await page.$eval('.AC5d8', handle => handle.innerText);
      const fullName = await page.$eval(
        '.rhpdm',
        fullName => fullName.innerText
      );
      const imageUrl = await page.$eval('img', img => img.src);
      const userData = await page.$$eval('.g47SY', data =>
        data.map(el => el.innerText)
      );

      let userObj = {
        handle,
        fullName,
        imageUrl,
        postCount: userData[0],
        followerCount: userData[1],
        followingCount: userData[2]
      };

      console.log('userObj in index is ', userObj);

      //close headless browser
      await browser.close();

      //return user data
      return res.json({ success: true, data: userObj });
    }
  } catch (e) {
    console.log('There was an error when trying to puppeteer the page ', e);
  }
});

/*
//Route to scrape users profile info continuously (10 times. once every 2 mins)
*/

// TODO modularize this file. Abstract repetition of getting user info and make a helper function.
app.get('/user_profile_continue/:profileName', async function(req, res) {
  //set an interval count so we can track when it reaches 10.
  let intervalCount = 0;

  //set interval to make a user scrape job every 2 mins
  let scrapeInterval = setInterval(() => {
    if (intervalCount === 10) {
      clearInterval(scrapeInterval);
      process.exit(0);
    } else {
      queue
        .create('userScrape', {
          profileName: req.params.profileName
        })
        .save();
      intervalCount++;
      console.log('made scrape job !!');
      console.log('interval count ', intervalCount);
    }
  }, 120000);

  /*
  //function that handles kue userscrape jobs.
  //concurrency set to 2 in case old jobs are present
  */
  queue.process('userScrape', 2, async function(job, done) {
    console.log('processing user scrape... ', job.data);
    let uri = baseUrl + '/' + job.data.profileName;
    try {
      let browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      page.setUserAgent(
        'Mozilla/5.0, (Macintosh; Intel Max OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/67.0.3372.0 Safari/537.36'
      );

      await page.evaluate('navigator.userAgent');
      console.log('uri in continue ', uri);
      const response = await page.goto(uri);

      console.log('response in continue ', response.status());

      const statusCode = response.status();

      if (statusCode === 404) {
        res.json({
          user: null,
          error: `User: ${profileName} does not exist. Please wait 30 seconds and submit a valid username`
        });
      } else {
        await page.waitForSelector('._6q-tv');

        let userInfo = [];

        const handle = await page.$eval('.AC5d8', handle => handle.innerText);
        const fullName = await page.$eval(
          '.rhpdm',
          fullName => fullName.innerText
        );
        const imageUrl = await page.$eval('img', img => img.src);
        const userData = await page.$$eval('.g47SY', data =>
          data.map(el => el.innerText)
        );

        let userObj = {
          handle,
          fullName,
          imageUrl,
          postCount: userData[0],
          followerCount: userData[1],
          followingCount: userData[2]
        };

        await browser.close();
        done();
        console.log('userObj in index is ', userObj);
      }
    } catch (e) {
      console.log('There was an error when trying to puppeteer the page ', e);
    }
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
