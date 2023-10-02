// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SwisstronikVoting is Ownable {
    using SafeMath for uint256;

    mapping(address => bool) private registeredVoters;
    mapping(bytes32 => uint256) private votes;

    event VoterRegistered(address indexed voter);
    event Voted(address indexed voter, bytes32 candidate);

    // Modifier to check if an address is a registered voter.
    modifier onlyRegisteredVoter() {
        require(registeredVoters[msg.sender], "Only registered voters can call this function");
        _;
    }

    // Function to register a new voter.
    function registerVoter(address _voter) external onlyOwner {
        require(!registeredVoters[_voter], "Voter already registered");
        registeredVoters[_voter] = true;
        emit VoterRegistered(_voter);
    }

    // Function for a registered voter to cast a vote.
    function vote(bytes32 _candidate) external onlyRegisteredVoter {
        votes[_candidate] = votes[_candidate].add(1);
        emit Voted(msg.sender, _candidate);
    }

    // Function to get the vote count for a candidate.
    function getVoteCount(bytes32 _candidate) external onlyRegisteredVoter view returns (uint256) {
        return votes[_candidate];
    }

    // Function to check if an address is a registered voter.
    function isRegisteredVoter(address _voter) external onlyRegisteredVoter view returns (bool) {
        return registeredVoters[_voter];
    }
}
