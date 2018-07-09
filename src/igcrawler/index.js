const express = require('express');
const path = require('path');
const axios = require('axios');
const kue = require('kue');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

let app = express();
let port = 8080;
let baseUrl = 'https://instagram.com';

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
