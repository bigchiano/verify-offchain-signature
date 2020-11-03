pragma solidity >=0.4.22 <0.7.0;

contract VerifySignature {
    // Counter reply attacks
    mapping(address => mapping(uint256 => bool)) public seenNonces;

    function verify(
        address owner,
        uint256 amount,
        uint256 nonce,
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS
    ) public returns (bool) {
        // This recreates the message hash that was signed on the client.
        bytes32 hash = keccak256(abi.encodePacked(owner, amount, nonce));
        bytes32 messageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );

        // Verify that the message's signer is the owner of the order

        // address signer = recover(messageHash, signature);
        address signer = ecrecover(messageHash, sigV, sigR, sigS);
        require(signer == owner, "Unauthorized access");

        require(!seenNonces[signer][nonce], "Duplicate nonce");
        seenNonces[signer][nonce] = true;
        return true;
    }
}
