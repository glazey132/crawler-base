const express = require('express');
const path = require('path');
const axios = require('axios');
const kue = require('kue');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const JSON5 = require('json5');

let app = express();
let port = 8080;
let baseUrl = 'https://instagram.com';

app.get('/user_profile/:profileName', async function(req, res) {
  let profileName = req.params.profileName;
  let uri = baseUrl + '/' + profileName;
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    page.setUserAgent(
      'Mozilla/5.0, (Macintosh; Intel Max OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/67.0.3372.0 Safari/537.36'
    );

    await page.evaluate('navigator.userAgent');
    const response = await page.goto(uri);

    const statusCode = response.status();

    if (statusCode === 404) {
      res.json({
        user: null,
        error: `User: ${profileName} does not exist. Please wait 30 seconds and submit a valid username`
      });
    }
    await page.waitForSelector('._6q-tv');

    let userInfo = [];

    const handle = await page.$eval('.AC5d8', handle => handle.innerText);
    const fullName = await page.$eval('.rhpdm', fullName => fullName.innerText);
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

    console.log('userObj ', userObj);

    return res.json({ data: userObj });
  } catch (e) {
    console.log('There was an error when trying to puppeteer the page ', e);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
