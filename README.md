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
To create the database, open your mongoDB shell and run the follow commands
```
use miloDB
```

## Running Milo Server
To run the server, open a terminal at the project root and run the following:
```
npm start
```


## Updating code

### milo-blocks
You need to run npm run prepare inside milo-blocks directory each time you make a change to milo-blocks that should be reflected in the GUI, then hard refresh. (No hot reloading)
