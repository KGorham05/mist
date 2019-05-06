# Elite4 Pokemon Fan Site

## [This](#) is a Fan Site
### Do you want to be the very best, like no one ever was? Then join The Elite 4 today! Keep up to date on the latest Pokemon news, and battle against your friends in an epic Pokemon faceoff! Sign up today...it's your destiny!  
    
[![Image from Gyazo](https://i.gyazo.com/ba8bf3a69edda47c7df9cba81a1fce75.gif)](https://gyazo.com/ba8bf3a69edda47c7df9cba81a1fce75)
  
This site was created as a fun way to practice and edify ourselves in the art of web design, using the [boilerplate provided to our class](https://github.com/Travo100/create-react-express-jwt).
Also in our learning, we relied upon the excellent game examples from [omgimanerd's Github](https://github.com/omgimanerd/how-to-build-a-multiplayer-browser-game), found through [this article](https://hackernoon.com/how-to-build-a-multiplayer-browser-game-4a793818c29b).

## To Start and Edit A Local Copy:

Add a .env at the top level of this project.

Then inside of the .env add a SERVER_SECRET set to any value you'd like

```
SERVER_SECRET = 123456
```

First off make sure you have a local version of MongoDB running on your machine. This project will make a local database for you called `appDB`.

```
mongod
```

Start by installing front and backend dependencies. While in the root directory, run the following command:

```
npm install
```

After all installations complete, run the following command in your terminal:

```
npm start
```

That's it, your app should be running on <http://localhost:3000>. The Express server should intercept any AJAX requests from the client.
