const PrivateKeyProvider = require("truffle-privatekey-provider");
const privateKey = process.env.privateKey
module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // for more about customizing your Truffle configuration!
    networks: {
        ropsten: {
            provider: new PrivateKeyProvider(privateKey, "https://ropsten.infura.io/v3/" + process.env.infuraKey),
            network_id: "*"
        },
        development: {
            host: "localhost",
            port: 7545,
            network_id: "*" // Match any network id
        }
    },
    compilers: {
        solc: {
            version: "0.5.8", // A version or constraint - Ex. "^0.5.0"
        }
    }
}
