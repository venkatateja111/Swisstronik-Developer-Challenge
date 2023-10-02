const fs = require("fs");

const getJsonFile = async (filePath, encoding = "utf8") => {
  let result =
    (await new Promise((resolve, reject) => {
      fs.readFile(filePath, encoding, (err, contents) => {
        if (err) {
          return resolve("{}");
        }
        resolve(contents);
      });
    })) || "{}";

  return JSON.parse(result);
};

const updateContractAddress = async (
  contractName,
  chainId,
  contractAddress,
  blockNumber
) => {
  const data = await getJsonFile("./address.json");
  var isChainIdAvailable = false;
  if (!data[contractName]) {
    data[contractName] = [];
    fs.writeFileSync("address.json", JSON.stringify(data, null, 2));
  }

  for (var i = 0; i < data[contractName].length; i++) {
    if (data[contractName][i].chainId === chainId) {
      isChainIdAvailable = true;
      data[contractName][i].contractAddress = contractAddress;
      data[contractName][i].blockNumber = blockNumber;
      break;
    }
  }

  if (!isChainIdAvailable) {
    var newLength = data[contractName].length;
    data[contractName][newLength] = {
      chainId: chainId,
      contractAddress: contractAddress,
      blockNumber
    };
  }

  fs.writeFileSync("address.json", JSON.stringify(data, null, 2));
};

const getContractAddress = async (contractName, chainId) => {
  const data = await getJsonFile("./address.json");
  if (!data[contractName]) {
    return;
  }
  for (var i = 0; i < data[contractName].length; i++) {
    if (data[contractName][i].chainId === chainId) {
      return data[contractName][i].contractAddress;
    }
  }
};

module.exports = {
  getJsonFile,
  updateContractAddress,
  getContractAddress
};
