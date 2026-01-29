const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const UGDES_Escrow = await hre.ethers.getContractFactory("UGDES_Escrow");
    const escrow = await UGDES_Escrow.deploy();

    await escrow.waitForDeployment();

    console.log("UGDES_Escrow deployed to:", await escrow.getAddress());

    const fs = require("fs");
    fs.writeFileSync("deployed_address.txt", await escrow.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
