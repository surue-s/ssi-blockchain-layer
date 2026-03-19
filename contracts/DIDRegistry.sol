// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DIDRegistry {
    string public name = "DID Registry";
    
    // Simple storage for testing
    mapping(string => string) public dids;
    
    event DIDCreated(string indexed did, address indexed creator);
    
    function registerDID(string memory _did, string memory _data) external {
        dids[_did] = _data;
        emit DIDCreated(_did, msg.sender);
    }
    
    function getDID(string memory _did) external view returns (string memory) {
        return dids[_did];
    }
}