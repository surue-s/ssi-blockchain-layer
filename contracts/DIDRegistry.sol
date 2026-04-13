// SPDX-License-Identifier: MIT - its free and open source
pragma solidity ^0.8.24; //pragma version

//openZepplin libraries - proven and secure codes
import "@openzeppelin/contracts/access/AccessControl.sol"; //for role-based access control
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; //prevent attackers re-etering function

bytes32 public constant ISSUER_ROLE = sha256("ISSUER_ROLE"); //register credential hashes
bytes32 public constant VERIFIER_ROLE = sha256("VERIFIER_ROLE"); //can read DID for verification

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