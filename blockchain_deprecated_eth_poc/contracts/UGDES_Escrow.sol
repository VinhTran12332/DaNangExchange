// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UGDES_Escrow {
    enum OrderState { CREATED, LOCKED, RELEASED, REFUNDED, DISPUTED }

    struct EscrowTx {
        address buyer;
        address seller;
        uint256 amount;
        uint256 lockedAt;
        OrderState state;
    }

    mapping(bytes32 => EscrowTx) public escrows;
    address public owner; // System Oracle

    event FundsLocked(bytes32 indexed orderId, address indexed buyer, uint256 amount);
    event FundsReleased(bytes32 indexed orderId, address indexed seller);
    event FundsRefunded(bytes32 indexed orderId, address indexed buyer);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Oracle can call this");
        _;
    }

    // Step 6: Buyer locks money
    function deposit(bytes32 orderId, address seller) external payable {
        require(msg.value > 0, "Amount must be > 0");
        require(escrows[orderId].amount == 0, "Order already exists");

        escrows[orderId] = EscrowTx({
            buyer: msg.sender,
            seller: seller,
            amount: msg.value,
            lockedAt: block.timestamp,
            state: OrderState.LOCKED
        });

        emit FundsLocked(orderId, msg.sender, msg.value);
    }

    // Step 11: System confirms delivery -> Release to Seller
    function releaseFunds(bytes32 orderId) external onlyOwner {
        EscrowTx storage txData = escrows[orderId];
        require(txData.state == OrderState.LOCKED, "Invalid state");

        // 2% Fee (Optional, simplified for POC)
        uint256 fee = (txData.amount * 2) / 100;
        uint256 sellerAmount = txData.amount - fee;

        txData.state = OrderState.RELEASED;

        payable(txData.seller).transfer(sellerAmount);
        payable(owner).transfer(fee); // Send fee to Marketplace

        emit FundsReleased(orderId, txData.seller);
    }

    // Dispute resolved -> Refund Buyer
    function refundBuyer(bytes32 orderId) external onlyOwner {
        EscrowTx storage txData = escrows[orderId];
        require(txData.state == OrderState.LOCKED, "Invalid state");

        txData.state = OrderState.REFUNDED;
        payable(txData.buyer).transfer(txData.amount);

        emit FundsRefunded(orderId, txData.buyer);
    }
}
