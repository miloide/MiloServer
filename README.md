# MiloServer

## Installing dependencies

```
git clone https://github.com/4and4/MiloServer.git
cd MiloServer
npm install
cd <MiloServer's parent folder>
git clone https://github.com/4and4/milo-blocks.git
cd milo-blocks
npm install
npm link
cd ../MiloServer
npm link milo-blocks
```

## Running Milo Server
To run the server, open a terminal at the project root and run the following:
```
node app.js
```