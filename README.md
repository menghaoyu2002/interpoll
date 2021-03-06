# Interpoll - The Internet Poll

Poll based social media website. Create, Share, Vote and Debate Polls.

Deployed at https://interpoll.netlify.app/

![alt text][image]

[image]: https://i.imgur.com/ECYCxkN.png "Website Image"

Backend deployed with [heroku](https://www.heroku.com)

Frontend deployed with [netlify](https://www.netlify.com/)

*Note*: You may have to wait a few seconds for the backend to "wake up" or load. This is because the backend is hosted on a Heroku free tier server, so it goes to sleep after inactivity.

# Tech stack
This website was built with the mern stack
- frontend built with react
- backend built with express + node 
- mongodb database

# Features
- Create polls annonymously
- Vote for polls annonymously
- View poll results 
- Create an account
- use of JWTs to authenticate user

Creating an account allows you to:
  - comment on polls
  - view your vote history, comment history, created polls
  - edit an delete your polls 
  - edit and delete your comments
  - edit your accounts settings
  - delete your account

# Possible Improvemnts
- refactor UserProfile page
- use more components over longer components (maybe)
- add better security (don't put jwt in sessionStorage)
- JWTs expire when page is closed, this can be quite annoying since opening a link in a new tab can log you out. Should use cookies for JWTs instead
- There is a bit of delay on delete operations, which results in a unsatisfactory user experience.
- deleting a comment sometimes requires the user to click the delete button twice.

# Installation and Setup

First run `npm install` then you will have access to the following commands.

To install dependencies run `npm run install`

In order to run the application you need to create a `.env` file in the `server` directory. In this `.env` file you need to define the following:
1. `MONGODB_URI=<YOUR_URL_HERE>`: This is the link to your database
2. `JWT_SECRET=<YOUR_JWT_SECRET_HERE>`: This is the JWT server used to encrypt JWT tokens.
3. Optional: `PORT=<YOUR_PORT_HERE>`: This is the port your backend server runs on.

Edit the `client/src/index.js` file and fill in your backend url as indicated by the `YOUR_BACKEND_URL_HERE` string. By default the url is http://localhost:5000, however you may change this if you used a different port.

To run the application run `npm run start`. This will open the application in your web brower. If the application does not open the url for the webpage can be found in the terminal.

# Warning
This is a sample website. <br/>

***DO NOT USE A PERSONAL PASSWORD WHEN REGISTERING FOR AN ACCOUNT.
THE DATABASE CAN BE ACCESSED FROM ALL SOURCES.***

# License 
[License](https://github.com/menghaoyu2002/interpoll/blob/main/LICENSE)
