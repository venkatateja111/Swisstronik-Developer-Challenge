require("@nomicfoundation/hardhat-toolbox");
require('dotenv/config')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    swisstronik: {
      url: "https://json-rpc.testnet.swisstronik.com/", //URL of the RPC node for Swisstronik.
      accounts: [`0x` + `${process.env.PRIVATE_KEY1}`, `0x` + `${process.env.PRIVATE_KEY2}`], //Your private key starting with "0x"
    },
  },
};
