const hre = require("hardhat");
const fs = require("fs");
const readline = require("readline");

// Load deployment info
let deploymentInfo;
if (fs.existsSync('deployment.json')) {
    deploymentInfo = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));
} else {
    console.error("deployment.json not found. Run 'npm run deploy:amoy' first.");
    process.exit(1);
}

const contractAddress = deploymentInfo.contractAddress;

async function main() {
    console.log("DIDRegistry Contract Tester");
    
    const [deployer] = await ethers.getSigners();
    console.log(`Testing with account: ${deployer.address}\n`);
    
    // Load contract
    const DIDRegistry = await hre.ethers.getContractFactory("DIDRegistry");
    const didRegistry = DIDRegistry.attach(contractAddress);
    
    // Test 1: Register a DID
    console.log("TEST 1: Register a DID");
    console.log("─".repeat(40));
    
    const testDID = `did:polygon:amoy:test${Math.floor(Math.random() * 10000)}`;
    const testPublicKey = '{"crv":"Ed25519","kty":"OKP","x":"testkey123abc"}';
    
    console.log(`🔹 Registering DID: ${testDID}`);
    
    try {
        const tx1 = await didRegistry.registerDID(testDID, testPublicKey);
        console.log(`Transaction: ${tx1.hash}`);
        
        const receipt1 = await tx1.wait();
        console.log(`DID registered successfully!`);
        console.log(`Gas used: ${receipt1.gasUsed.toString()}\n`);
    } catch (error) {
        console.error(`Error: ${error.message}\n`);
        return;
    }
    
    // Test 2: Get DID Document
    console.log("TEST 2: Get DID Document");
    console.log("─".repeat(40));
    
    try {
        const document = await didRegistry.getDIDDocument(testDID);
        console.log("DID Document retrieved:");
        console.log(`Owner: ${document.owner}`);
        console.log(`Public Key: ${document.publicKeyJwk}`);
        console.log(`Active: ${document.active}`);
        console.log(`Created: ${new Date(document.created * 1000).toISOString()}\n`);
    } catch (error) {
        console.error(`Error: ${error.message}\n`);
        return;
    }
    
    // Test 3: Register Credential Hash
    console.log("TEST 3: Register Credential Hash");
    console.log("─".repeat(40));
    
    const credentialHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("test_credential_data")
    );
    const issuerDID = "did:polygon:amoy:testissuer";
    
    console.log(`🔹 Registering credential hash: ${credentialHash.slice(0, 20)}...`);
    
    try {
        const tx2 = await didRegistry.registerCredentialHash(
            testDID,
            credentialHash,
            "AgeProof",
            issuerDID
        );
        console.log(`Transaction: ${tx2.hash}`);
        
        const receipt2 = await tx2.wait();
        console.log(`Credential hash registered successfully!`);
        console.log(` Gas used: ${receipt2.gasUsed.toString()}\n`);
    } catch (error) {
        console.error(`Error: ${error.message}\n`);
        return;
    }
    
    // Test 4: Verify Credential Hash
    console.log("TEST 4: Verify Credential Hash");
    console.log("─".repeat(40));
    
    try {
        const exists = await didRegistry.isCredentialHashRegistered(testDID, credentialHash);
        if (exists) {
            console.log("Credential hash verified successfully!\n");
        } else {
            console.log("Credential hash not found!\n");
        }
    } catch (error) {
        console.error(`Error: ${error.message}\n`);
        return;
    }
    
    // Test 5: Get Credential Hashes
    console.log("TEST 5: Get Credential Hashes");
    console.log("─".repeat(40));
    
    try {
        const hashes = await didRegistry.getCredentialHashes(testDID);
        console.log(`Found ${hashes.length} credential hash(es):`);
        hashes.forEach((hash, index) => {
            console.log(`   ${index + 1}. Type: ${hash.credentialType}`);
            console.log(`      Hash: ${hash.hash.slice(0, 20)}...`);
            console.log(`      Issuer DID: ${hash.issuerDID}`);
        });
        console.log();
    } catch (error) {
        console.error(`❌ Error: ${error.message}\n`);
        return;
    }
    
    // Test 6: Update Public Key
    console.log("TEST 6: Update Public Key");
    console.log("─".repeat(40));
    
    const newPublicKey = '{"crv":"Ed25519","kty":"OKP","x":"newkey456xyz"}';
    console.log(`🔹 Updating public key...`);
    
    try {
        const tx3 = await didRegistry.updatePublicKey(testDID, newPublicKey);
        console.log(`Transaction: ${tx3.hash}`);
        
        const receipt3 = await tx3.wait();
        console.log(`Public key updated successfully!`);
        console.log(`Gas used: ${receipt3.gasUsed.toString()}\n`);
    } catch (error) {
        console.error(`Error: ${error.message}\n`);
        return;
    }
    
    // Test 7: Get DID Count
    console.log("TEST 7: Get DID Count");
    console.log("─".repeat(40));
    
    try {
        const count = await didRegistry.getDIDCount();
        console.log(`Total registered DIDs: ${count.toString()}\n`);
    } catch (error) {
        console.error(`Error: ${error.message}\n`);
        return;
    }
    
    // Test 8: Deactivate DID
    console.log("TEST 8: Deactivate DID");
    console.log("─".repeat(40));
    
    console.log(`🔹 Deactivating DID...`);
    
    try {
        const tx4 = await didRegistry.deactivateDID(testDID);
        console.log(`Transaction: ${tx4.hash}`);
        
        const receipt4 = await tx4.wait();
        console.log(`DID deactivated successfully!`);
        console.log(`Gas used: ${receipt4.gasUsed.toString()}\n`);
    } catch (error) {
        console.error(`Error: ${error.message}\n`);
        return;
    }
    
    // Summary
    console.log("RAWRRR COMPLETED !");
    
    console.log("📊 Test Summary:");
    console.log(`DID Registration`);
    console.log(`Get DID Document`);
    console.log(`Register Credential Hash`);
    console.log(`Verify Credential Hash`);
    console.log(`Get Credential Hashes`);
    console.log(`Update Public Key`);
    console.log(`Get DID Count`);
    console.log(`Deactivate DID\n`);
    
    console.log("🔗 View on Polygonscan:");
    console.log(`   ${deploymentInfo.blockExplorer}\n`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("sad lol:");
        console.error(error);
        process.exit(1);
    });