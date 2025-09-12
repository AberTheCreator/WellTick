import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const runCommand = (command: string, cwd?: string) => {
  try {
    console.log(`🔧 ${command}`);
    execSync(command, { 
      stdio: 'inherit', 
      cwd: cwd || process.cwd() 
    });
  } catch (error) {
    console.error(`❌ Failed: ${command}`);
    throw error;
  }
};

async function buildProduction() {
  console.log(" Building Welltick for production...\n");

  try {
    
    console.log("🧹 Cleaning previous builds...");
    ['backend/dist', 'frontend/build', 'shared/dist'].forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true });
        console.log(`🗑️  Removed: ${dir}`);
      }
    });

    
    console.log("\n Building shared types...");
    runCommand('npm run build', 'shared');

    
    console.log("\n Building backend...");
    runCommand('npm run build', 'backend');

    
    console.log("\n Building frontend...");
    runCommand('npm run build', 'frontend');

    
    console.log("\n Compiling smart contracts...");
    runCommand('npm run compile', 'contracts');

    const packageInfo = {
      name: "welltick",
      version: "1.0.0",
      description: "AI-powered accessibility and wellness platform",
      buildDate: new Date().toISOString(),
      components: {
        frontend: "React.js application",
        backend: "Node.js API server", 
        contracts: "Solidity smart contracts",
        shared: "TypeScript type definitions"
      }
    };

    fs.writeFileSync('build-info.json', JSON.stringify(packageInfo, null, 2));

    console.log("\n✅ Production build completed successfully!");
    console.log("\n Build artifacts:");
    console.log("- Frontend: ./frontend/build/");
    console.log("- Backend: ./backend/dist/");
    console.log("- Contracts: ./contracts/artifacts/");
    console.log("- Shared: ./shared/dist/");
    
    console.log("\n🚀 Ready for deployment!");

  } catch (error) {
    console.error("\n❌ Build failed:", error);
    process.exit(1);
  }
}

buildProduction(); Deploy WelltickToken
  console.log("\n📄 Deploying WelltickToken...");
  const WelltickToken = await ethers.getContractFactory("WelltickToken");
  const welltickToken = await WelltickToken.deploy();
  await welltickToken.waitForDeployment();
  const tokenAddress = await welltickToken.getAddress();
  console.log("✅ WelltickToken deployed to:", tokenAddress);