# MiloServer

## Installing dependencies

Install node v6.9.0 or above, and npm 3.10.8 or above
Install mongoDB from https://docs.mongodb.com/manual/tutorial/ based on your operating system.

```
git clone https://github.com/4and4/milo-blocks.git
cd milo-blocks
npm install
npm run prepare
npm link
cd ..
git clone https://github.com/4and4/MiloServer.git
cd MiloServer
npm install
npm link milo-blocks
npm link
```
## Creating Database

* Make sure mongodb is installed (Google for OSX Specific details)
* Run the mongo deamon `mongod --dbpath ../milo-data/` and run `mongo` to open the cli`
To create the database, open your mongoDB shell and run the follow commands
```
use miloDB
db.dummy.insert({'v':'1.0'});
```

## Add Oauth2 Credentials

Create a file called `credentials.js` in `config/`, and add the following:
```
module.exports = {
    'googleAuth':{
        'clientID' : 'CLIENT_ID',
        'clientSecret' :'CLIENT_SECRET',
        'devCallback' : 'http://localhost:5000/users/auth/google/callback',
        'prodCallback': 'https://example.com/users/auth/google/callback'
    }
};

```

## Running Milo Server

To start the mongo deamon in the background
```
mongod --fork --dbpath ../milo-data/ --logpath ../milo-data/mongo.log
```
To run the server, open a terminal at the project root and run the following:
```
npm start
```
The `mongod` command is only needed if the mongo deamon is not started

## Updating code

### milo-blocks
You need to run npm run prepare inside milo-blocks directory each time you make a change to milo-blocks that should be reflected in the GUI, then hard refresh. (No hot reloading)
