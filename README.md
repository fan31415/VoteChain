# VoteChain

web directory for frontend and backend development

# Requirement
* Node.js v8.14.0
* Express
* [Ganache](https://truffleframework.com/ganache)

# Preliminary
**Notice:** *All commands should be executed under project root directory*

* Install supervisor

  ```
  npm install supervisor -g
  ```

* Install truffle

	```
	npm install truffle@4.1.15 -g
	```
	
* Install NPM dependencies

	```
	cd web &&npm install
	```
	
	```
	cd chain && npm install
	```
* Open Ganache(click app icon or use ganache-cli)
* Build and test blockchain contract

	```
	cd chain && truffle test
	```
# Run
Run the following commands at project root location to start the website

```
supervisor web/bin/www
```


# Notice
Due to the [issue](https://github.com/trufflesuite/truffle/issues/1909) with truffle, we do not use the lastest version, but use the following stable setting:

* truffle `4.1.15`
* `"openzeppelin-solidity": "^2.0.0"`
* `pragma solidity ^0.4.2`

