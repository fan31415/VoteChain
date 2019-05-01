// var HDWalletProvider = require("truffle-hdwallet-provider");
// var mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // for more about customizing your Truffle configuration!
    networks: {
        // ropsten: {
        //     provider: function() {
        //         return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/j0NInWvBFYLdSKnPR3b3")
        //     }
        // },
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
    },
    // Set default mocha options here, use special reporters etc.
    mocha: {
        // timeout: 100000
    }
}