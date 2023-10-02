const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/swisstronik.js");
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

const sendShieldedTransaction = async (signer, destination, data, value) => {
    const rpclink = hre.network.config.url;
    const [encryptedData] = await encryptDataField(rpclink, data);
    return await signer.sendTransaction({
        from: signer.address,
        to: destination,
        data: encryptedData,
        value,
    });
};

async function main() {
    await fetchAccounts()
    const chainId = await hre.ethers.provider.getNetwork().then(network => network.chainId.toString());
    const contractAddress = await getContractAddress(contractName, chainId)
    const signer = addr1
    const contractFactory = await hre.ethers.getContractFactory(contractName);
    const contract = contractFactory.attach(contractAddress);
    const functionName = "vote";
    const candidate = hre.ethers.encodeBytes32String('candidate1');
    const tx = await sendShieldedTransaction(signer, contractAddress, contract.interface.encodeFunctionData(functionName, [candidate]), 0);
    await tx.wait();
    console.log("Transaction Receipt: ", tx);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});