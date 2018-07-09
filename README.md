# Web Crawler Base.

A modularized web crawler built with Node.js / Express.js, Puppeteer.js and Kue.js. Puppeteer provides the functionality that allows it to scrape an Instagram users' profile information,
and Kue provides the functionality to continuously scrape a user's profile every 2 mins for 10 scrapes.

The modular nature of this web crawler lends itself to easy pivoting in terms of both which target site it should scrape, and what information it should look for.

More web crawler features and functionality will be added to this base.  
I put up this challenge on [CODEWARS](http://codewars.com) (was rated about 2 kata) a year ago and became really popular among the community of hackers. It was a short challenge that took 2 - 3 hours and most developers had fun building it and continue to use it for other everyday purposes. The idea and concept of it applies to real life applications that are relevant in today's data-driven world.

- Language: Javascript
- Technology: Node.js, Express
- Difficulty: Medium
- Completion time: 2 - 3 hours. Took lead engineer 1.5 hour to complete. Shoudn't take you more than 5 hours. It doesn't count against you, but please explain why and provide evidence to prove your point. A good engineer is also a good lawyer ;)

Things we will look for:

- Everything is modulized. Comments to explain your reasoning (I don't need a paragraph explaining. Good engineers will explain in a few sentences)
- Efficiency. code is clean, neat and organized.
- Memory, CPU handling.
- Every error is handled.
- Design and Architecture structure.
- Knowledge of browserless technology
- Routing
- Data manipulation.
- Automation using kue or other job priority libs.

### Detail:

**Learning experience 1:**  
Build an API with scraper.  
When you invent new products, sometimes the data you need isn't available for you yet. Therefore, you must scrape the internet to provide the data for the client users.

**Learning experience 2:**  
Understand data process.  
In order to be a good developer, you must know the lifecycle of every data/parameter/variable you use and HOW, WHY, WHEN they change. This is just simple data process question. That's why you must parse all the data you scrape into a readible JSON format.

### Instructions:

Build two routes: **GET:{baseUrl}/user_profile** and **GET:{baseUrl}/user_profile_continue**

Please upload to a server. AWS, Digital Ocean, Heroku, you're own IP Address, etc...it doesn't matter as long as it works somewhere.

### Part 1:

Parameter: username  
Tools (You don't have to use these. You may use different ones or add more if you'd like):

- cheerio
- puppeteer
- $q

{baseUrl}/user_profile will scrape for user information and returns a JSON formatted response. For example:

```
{
  data: {
    "username": "kingjames",
    "fullName": "Lebron James",
    "imageUrl": "profileimage.orsomething.com",
    "followers": 3.2M,
    "following": 123,
    "posts": 204
  }
}
```

You may provide more information if you'd like but those are the most important ones.

**Errors:**
If there are errors such as "no users exist" or "private users" please handle them correctly.

### Part 2:

Parameter: username  
Tools (You don't have to use these. You may use different ones or add more if you'd like):

- cheerio
- puppeteer
- $q
- kue

GET:{baseUrl}/user_profile_continue will do the same thing BUT it will continue to scrape and console.log out the response every 2 minutes.

For example this is what it should show on the terminal:

```
After 2 minutes...
{
  data: {
    "username": "kingjames",
    "fullName": "Lebron James",
    "imageUrl": "profileimage.orsomething.com",
    "followers": 3.2M,
    "following": 123,
    "posts": 204
  }
}

After 2 minutes...
{
  data: {
    "username": "kingjames",
    "fullName": "Lebron James",
    "imageUrl": "profileimage.orsomething.com",
    "followers": 3.2M,
    "following": 123,
    "posts": 204
  }
}

After 2 minutes...
{
  data: {
    "username": "kingjames",
    "fullName": "Lebron James",
    "imageUrl": "profileimage.orsomething.com",
    "followers": 3.2M,
    "following": 123,
    "posts": 204
  }
}

and so on...
```
