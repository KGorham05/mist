# Elite4 Pokemon Fan Game

## [This](https://pokemon2-cbc.herokuapp.com) is a Fan Game

We created it as a fun way to practice and edify ourselves in the art of web design, using the [boilerplate provided to our class](https://github.com/Travo100/create-react-express-jwt).
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
