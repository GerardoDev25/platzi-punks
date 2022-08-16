// const { ethers } = require('hardhat');

const deploy = async () => {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contract with account: ', deployer.address);

  const platziPunks = await ethers.getContractFactory('PlatziPunks');
  const deployed = await platziPunks.deploy();

  console.log('PlatziPunks is deployed in: ', deployed.address);
};

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
