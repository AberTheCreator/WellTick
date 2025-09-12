import { ethers } from "hardhat";
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log("🚀 Starting Welltick smart contract deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  
  console.log("\n📄 Deploying WelltickToken...");
  const WelltickToken = await ethers.getContractFactory("WelltickToken");
  const welltickToken = await WelltickToken.deploy();
  await welltickToken.waitForDeployment();
  const tokenAddress = await welltickToken.getAddress();
  console.log("✅ WelltickToken deployed to:", tokenAddress);

  console.log("\n📄 Deploying WelltickIdentity...");
  const WelltickIdentity = await ethers.getContractFactory("WelltickIdentity");
  const welltickIdentity = await WelltickIdentity.deploy();
  await welltickIdentity.waitForDeployment();
  const identityAddress = await welltickIdentity.getAddress();
  console.log("✅ WelltickIdentity deployed to:", identityAddress);

  console.log("\n📄 Deploying WelltickDataVault...");
  const WelltickDataVault = await ethers.getContractFactory("WelltickDataVault");
  const welltickDataVault = await WelltickDataVault.deploy();
  await welltickDataVault.waitForDeployment();
  const vaultAddress = await welltickDataVault.getAddress();
  console.log("✅ WelltickDataVault deployed to:", vaultAddress);

  console.log("\n⚙️ Setting up token contract...");
  await welltickToken.setAuthorizedRewarder(deployer.address, true);
  console.log("✅ Deployer set as authorized rewarder");

  console.log("\n🔍 Verifying deployments...");
  const tokenName = await welltickToken.name();
  const tokenSymbol = await welltickToken.symbol();
  const identityName = await welltickIdentity.name();
  const identitySymbol = await welltickIdentity.symbol();
  
  console.log(`✅ Token: ${tokenName} (${tokenSymbol})`);
  console.log(`✅ Identity: ${identityName} (${identitySymbol})`);
  console.log(`✅ Data Vault deployed successfully`);

  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      WelltickToken: tokenAddress,
      WelltickIdentity: identityAddress,
      WelltickDataVault: vaultAddress,
    },
    deployedAt: new Date().toISOString(),
  };

  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  const fs = require('fs');
  const path = require('path');
  const deploymentPath = path.join(__dirname, '../deployment.json');
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${deploymentPath}`);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📝 Next steps:");
  console.log("1. Update your .env files with the new contract addresses");
  console.log("2. Verify contracts on block explorer (optional)");
  console.log("3. Configure frontend with new contract addresses");
  console.log("4. Test token rewards and credential minting");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });