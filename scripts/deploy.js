const hre = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🚀 Deploying DIDRegistry to Polygon Amoy Testnet...\n");
    
    // Get deployer
    const [deployer] = await ethers.getSigners();
    console.log(`📝 Deploying from account: ${deployer.address}`);
    
    // Get account balance
    const balance = await deployer.getBalance();
    console.log(`💰 Account balance: ${ethers.utils.formatEther(balance)} MATIC\n`);
    
    // Check if we have enough MATIC
    if (balance.lt(ethers.utils.parseEther("0.1"))) {
        console.error("❌ Insufficient MATIC balance!");
        console.error("Please get testnet MATIC from: https://faucet.polygon.technology/");
        process.exit(1);
    }
    
    // Deploy contract
    console.log("⏳ Deploying contract...\n");
    const DIDRegistry = await hre.ethers.getContractFactory("DIDRegistry");
    const didRegistry = await DIDRegistry.deploy();
    await didRegistry.deployed();
    
    console.log(`✅ DIDRegistry deployed successfully!`);
    console.log(`📍 Contract address: ${didRegistry.address}\n`);
    
    // Wait a few seconds for blockchain to finalize
    console.log("⏳ Waiting for transaction confirmation...\n");
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Save deployment info
    const deploymentInfo = {
        network: "polygonAmoy",
        chainId: 80002,
        contractAddress: didRegistry.address,
        deployer: deployer.address,
        deploymentTime: new Date().toISOString(),
        deploymentBlock: await ethers.provider.getBlockNumber(),
        blockExplorer: `https://amoy.polygonscan.com/address/${didRegistry.address}`,
        rpcUrl: "https://rpc-amoy.polygon.technology/",
        description: "DIDRegistry for SSI Mobile Wallet"
    };
    
    fs.writeFileSync(
        'deployment.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("✅ Deployment info saved to deployment.json");
    console.log(`🔗 View on Polygonscan: ${deploymentInfo.blockExplorer}\n`);
    
    // Display next steps
    console.log("========================================");
    console.log("🎉 NEXT STEPS:");
    console.log("========================================");
    console.log("\n1. Verify contract on Polygonscan (optional):");
    console.log(`   npx hardhat verify --network polygonAmoy ${didRegistry.address}`);
    console.log("\n2. Test contract interactions:");
    console.log("   npx hardhat run scripts/test-interactions.js --network polygonAmoy");
    console.log("\n3. View deployment info:");
    console.log("   cat deployment.json");
    console.log("\n4. Interact with contract on Polygonscan:");
    console.log(`   ${deploymentInfo.blockExplorer}`);
    console.log("\n========================================\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });