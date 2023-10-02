const hre = require("hardhat");
const { updateContractAddress } = require('../utils/helpers')

async function main() {

  const contractName = "SwisstronikVoting"

  const contract = await hre.ethers.deployContract(contractName);

  await contract.waitForDeployment();

  const deployedBlockNumber = await hre.ethers.provider.getBlockNumber();
  const deployedChainId = await hre.ethers.provider.getNetwork().then(network => network.chainId.toString());

  console.log(`Swisstronik contract deployed to ${contract.target}`);

  await updateContractAddress(
    contractName,
    deployedChainId,
    contract.target,
    deployedBlockNumber
  )

}

//DEFAULT BY HARDHAT:
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});