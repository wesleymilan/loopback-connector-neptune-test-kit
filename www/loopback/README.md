# Loopback Connector for AWS Neptune Test Development Kit

This is the test kit repository for **Loopback Neptune Connector**, what uses Gremlin language to communicate to Cloud 
Service.

To simulate AWS Neptune we're using Apache TinkerPOP Gremlin Server.

---
**NOTE** that AWS Neptune has some limitations and differences from default TinkerPOP Server, we've tried to 
configure TinkerPOP as similar as possible to emulate AWS Neptune, but this environment was created to make
developers lives easier when coding, but before committing and/or creating a pull request, please run your tests
using a real AWS Neptune Instance.
---

To start working on this project you must have [Docker](https://www.docker.com/) installed.

## Building the environment
The very first command you should run is:
```
./docker/init.sh
```
This command will clone **Loopback Neptune Connector** repository into `www` folder, and install all dependencies.

If for any reason you need to rebuild your docker containers you can run:
```
./docker/rebuild.sh
```

To run your environment you can run docker composer default commands or use:
- `./docker/up.sh`: To start all of your containers in demon mode
- `./docker/stop.sh`: To stop all of your containers at once

### Running tests
After having your environment running you can access Loopback container to run the tests:
```
./docker/loopback/ssh.sh
```

Run tests from inside Loopback container using:
```
npm test
```

### Running Loopback manually
```
./docker/loopback/ssh.sh
node .
```

Now open the following URL in your browser:
```
http://localhost:3010/
```

### Using Gremlin Visualizer to see GraphDB data
Open the following address in your browser:
```
http://localhost:3000/
```

In the host field of your GV use the address `neptune.docker` with port `8182`.

## What is this project about?
It's a very basic structure for a social media platform compound of People, Page, Post and PostOwner models,
repositories and controllers.

The intent here is to test CRUD methods and transaction operations with raw queries using Gremlin Bytecode.

## How to collaborate
These tests don't cover all methods yet, and would be great if you could collaborate, cloning implementing new tests
and creating a pull request to the original repository.

**JOIN THE TEAM**

