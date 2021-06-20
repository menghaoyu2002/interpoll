# Interpoll - The Internet Poll

Poll based social media website. Create, Share, Vote and Debate Polls.

![alt text][image]

[image]: https://i.imgur.com/ECYCxkN.png "Website Image"

Deployed at https://interpoll.netlify.app/

Backend deployed with [heroku](https://www.heroku.com)

Frontend deployed with [netlify](https://www.netlify.com/)

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


# Possible Improvemnts
- refactor UserProfile page
- use more components over longer components (maybe)
- add better security (don't put jwt in sessionStorage)
- JWTs expire when page is closed, this can be quite annoying since opening a link in a new tab can log you out. Should use cookies for JWTs instead

# NOTE
This is a sample website. <br/>
DO NOT USE ENTER A PERSONAL PASSWORD WHEN REGISTERING FOR AN ACCOUNT.<br/>
THE DATABASE CAN BE ACCESSED FROM ALL SOURCES.<br/>


