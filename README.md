# Web Crawler Base

A modularized web crawler built with Node.js / Express.js, Puppeteer.js and Kue.js. Puppeteer provides the functionality that allows it to scrape an Instagram users' profile information,
and Kue provides the functionality to continuously scrape a user's profile every 2 mins for 10 scrapes.

The modular nature of this web crawler lends itself to easy pivoting in terms of both which target site it should scrape, and what information it should look for.

More web crawler features and functionality will be added to this base.

# Routes

- GET:{baseUrl}/user_profile will scrape for user information and returns a JSON formatted response. For example:

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

- GET:{baseUrl}/user_profile_continue will do the same thing BUT it will continue to scrape and console.log out the response every 2 minutes.

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
