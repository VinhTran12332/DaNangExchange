const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UGDES_Escrow", function () {
    let Escrow, escrow;
    let owner, buyer, seller;
    const orderId = ethers.encodeBytes32String("ORDER_123");
    const price = ethers.parseEther("1.0"); // 1 ETH

    beforeEach(async function () {
        [owner, buyer, seller] = await ethers.getSigners();
        Escrow = await ethers.getContractFactory("UGDES_Escrow");
        escrow = await Escrow.deploy();
    });

    it("Should allow Buyer to deposit funds (Lock)", async function () {
        await escrow.connect(buyer).deposit(orderId, seller.address, { value: price });

        const txData = await escrow.escrows(orderId);
        expect(txData.buyer).to.equal(buyer.address);
        expect(txData.amount).to.equal(price);
        expect(txData.state).to.equal(1); // LOCKED
    });

    it("Should allow Owner (Oracle) to release funds to Seller", async function () {
        // 1. Lock First
        await escrow.connect(buyer).deposit(orderId, seller.address, { value: price });

        // 2. Release
        await expect(escrow.connect(owner).releaseFunds(orderId))
            .to.changeEtherBalances([seller, owner], [ethers.parseEther("0.98"), ethers.parseEther("0.02")]);

        const txData = await escrow.escrows(orderId);
        expect(txData.state).to.equal(2); // RELEASED
    });

    it("Should allow Owner to refund Buyer", async function () {
        // 1. Lock First
        await escrow.connect(buyer).deposit(orderId, seller.address, { value: price });

        // 2. Refund
        await expect(escrow.connect(owner).refundBuyer(orderId))
            .to.changeEtherBalances([buyer], [price]);

        const txData = await escrow.escrows(orderId);
        expect(txData.state).to.equal(3); // REFUNDED
    });
});
