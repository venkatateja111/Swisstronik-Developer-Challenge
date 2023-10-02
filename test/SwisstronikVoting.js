require('dotenv/config')
const { expect } = require("chai");
const { ethers } = require("hardhat");

let contractName = "SwisstronikVoting"
let SwisstronikVotingContract;
let candidate1, candidate2

before(async function () {

    [owner, ...addrs] = await ethers.getSigners()

    SwisstronikVotingContract = await ethers.deployContract(contractName);

    await SwisstronikVotingContract.waitForDeployment();

    candidate1 = ethers.encodeBytes32String('candidate1')
    candidate2 = ethers.encodeBytes32String('candidate2')

});

describe(`Testing ${contractName} contract`, function () {
    it("testing if registeredVoters private state variable is accessible or not", async function () {
        try {
            await SwisstronikVotingContract.registeredVoters(owner)
        } catch (error) {
            expect(error.message).to.include("SwisstronikVotingContract.registeredVoters is not a function");
        }
    })

    it("testing if votes private state variable is accessible or not", async function () {
        try {
            await SwisstronikVotingContract.votes(candidate1)
        } catch (error) {
            expect(error.message).to.include("SwisstronikVotingContract.votes is not a function");
        }
    })

    it("should allow the owner to register voters", async function () {
        // Deployer is the owner by default
        await expect(
            SwisstronikVotingContract.registerVoter(owner.address)
        ).to.emit(SwisstronikVotingContract, "VoterRegistered")

        await expect(
            SwisstronikVotingContract.registerVoter(addrs[1].address)
        ).to.emit(SwisstronikVotingContract, "VoterRegistered")
    });

    it("check if voter is registered or not", async function () {
        expect(await SwisstronikVotingContract.isRegisteredVoter(owner.address)).to.equal(true);
        expect(await SwisstronikVotingContract.isRegisteredVoter(addrs[1].address)).to.equal(true);
    });

    it("should revert if other than owner is trying to register voter", async function () {
        await expect(
            SwisstronikVotingContract.connect(addrs[1]).registerVoter(owner.address)
        ).to.be.revertedWith("Ownable: caller is not the owner")
    });

    it("should revert if owner is trying to register a voter who is already registered", async function () {
        await expect(
            SwisstronikVotingContract.registerVoter(owner.address)
        ).to.be.revertedWith("Voter already registered")
        await expect(
            SwisstronikVotingContract.registerVoter(addrs[1].address)
        ).to.be.revertedWith("Voter already registered")
    });

    it("testing vote function for registered voters", async function () {
        await expect(
            SwisstronikVotingContract.vote(candidate1)
        ).to.emit(SwisstronikVotingContract, "Voted")
        await expect(
            SwisstronikVotingContract.vote(candidate2)
        ).to.emit(SwisstronikVotingContract, "Voted")
        await expect(
            SwisstronikVotingContract.connect(addrs[1]).vote(candidate1)
        ).to.emit(SwisstronikVotingContract, "Voted")
        await expect(
            SwisstronikVotingContract.connect(addrs[1]).vote(candidate2)
        ).to.emit(SwisstronikVotingContract, "Voted")
    });

    it("should revert if unregistered voter is trying to vote", async function () {
        await expect(
            SwisstronikVotingContract.connect(addrs[2]).vote(candidate1)
        ).to.be.revertedWith("Only registered voters can call this function")
    });
    
    it("testing getVoteCount function", async function () {
        expect(await SwisstronikVotingContract.getVoteCount(candidate1)).to.equal(2)
        expect(await SwisstronikVotingContract.getVoteCount(candidate2)).to.equal(2)
    })

    it("should revert if unregistered voter is trying to interact with the contract", async function () {
        await expect(
            SwisstronikVotingContract.connect(addrs[2]).getVoteCount(candidate1)
        ).to.be.revertedWith("Only registered voters can call this function")
        await expect(
            SwisstronikVotingContract.connect(addrs[2]).isRegisteredVoter(addrs[1])
        ).to.be.revertedWith("Only registered voters can call this function")
    });

    
})