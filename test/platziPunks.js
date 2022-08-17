const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Platzi Punks Contact', () => {
  const setup = async ({ maxSupply = 10000 }) => {
    const [owner] = await ethers.getSigners();
    const platziPunks = await ethers.getContractFactory('PlatziPunks');

    const deployed = await platziPunks.deploy(maxSupply);

    return { owner, deployed };
  };

  describe('Deployment', () => {
    it('Sets max supply to passed params', async () => {
      const maxSupply = 4000;
      const { deployed } = await setup({ maxSupply });

      const returnetMaxSupply = await deployed.maxSupply();

      expect(maxSupply).to.equal(returnetMaxSupply);
    });
  });

  describe('Minting', () => {
    it('Mint a new token in assings it to owner', async () => {
      const maxSupply = 4000;
      const { deployed, owner } = await setup({ maxSupply });

      await deployed.mint();

      const ownerOfMinted = await deployed.ownerOf(0);
      expect(ownerOfMinted).to.equal(owner.address);
    });

    it('Has a minting limit', async () => {
      const maxSupply = 2;

      const { deployed } = await setup({ maxSupply });

      // Mint all
      await Promise.all([deployed.mint(), deployed.mint()]);

      // Assert the last minting
      await expect(deployed.mint()).to.be.revertedWith('No PlatziPunks left :(');
    });
  });

  describe('tokenURI', () => {
    it('retuens a valid metadata', async () => {
      const { deployed } = await setup({});
      await deployed.mint();

      const tokenURI = await deployed.tokenURI(0);
      const stringiFiedTokenURI = await tokenURI.toString();

      const [_, base64JSON] = stringiFiedTokenURI.split('data:application/json;base64,');

      const stringiMetadata = await Buffer.from(base64JSON, 'base64').toString('ascii');

      const metadata = JSON.parse(stringiMetadata);

      expect(metadata).to.have.all.keys('name', 'description', 'image');
    });
  });
});
