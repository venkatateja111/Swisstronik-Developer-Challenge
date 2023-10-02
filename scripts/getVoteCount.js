const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/swisstronik.js");
const { getContractAddress } = require('../utils/helpers')

const contractName = "SwisstronikVoting"

var owner, addr1

async function fetchAccounts() {
    try {
        [owner, addr1] = await hre.ethers.getSigners();
    } catch (err) {
        console.log(err)
    }
}

const sendShieldedQuery = async (provider, destination, data) => {
    try {
        const rpclink = hre.network.config.url;
        const [encryptedData, usedEncryptedKey] = await encryptDataField(rpclink, data);
        const response = await provider.call({
            to: destination,
            data: encryptedData,
        });
        return await decryptNodeResponse(rpclink, response, usedEncryptedKey);
    } catch (err) {
        console.log(err.message)
    }
};

async function main() {
    await fetchAccounts()
    const chainId = await hre.ethers.provider.getNetwork().then(network => network.chainId.toString());
    const contractAddress = await getContractAddress(contractName, chainId)
    const signer = addr1
    const contractFactory = await hre.ethers.getContractFactory(contractName);
    const contract = contractFactory.attach(contractAddress);
    const functionName = "getVoteCount";
    const candidate = hre.ethers.encodeBytes32String('candidate1');
    const responseMessage = await sendShieldedQuery(signer.provider, contractAddress, contract.interface.encodeFunctionData(functionName, [candidate]));
    console.log("Decoded response:", responseMessage);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
