// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

// import "./ERC20.sol";

/**
 * @title ERC20
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
interface ERC20 {
  function balanceOf(address who) external returns (uint256);
  function transfer(address to, uint256 value) external returns (bool);
  function allowance(address owner, address spender) external returns (uint256);
  function transferFrom(address from, address to, uint256 value) external returns (bool);
  function approve(address spender, uint256 value) external returns (bool);

  event Approval(address indexed owner, address indexed spender, uint256 value);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

contract TimeLockedWallet {

    address public creator;
    address public owner;
    uint256 public unlockDate;
    uint256 public createdAt;

    struct EIP712Domain {
        string name;
        string version;
        uint256 chainId;
        address verifyingContract;
    }
    struct MetaTransaction {
            uint256 nonce;
            address from;
    }

    mapping(address => uint256) public nonces;

    bytes32 internal constant EIP712_DOMAIN_TYPEHASH = keccak256(bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"));
    bytes32 internal constant META_TRANSACTION_TYPEHASH = keccak256(bytes("MetaTransaction(uint256 nonce,address from)"));
    bytes32 internal DOMAIN_SEPARATOR = keccak256(abi.encode(
        EIP712_DOMAIN_TYPEHASH,
            keccak256(bytes("TimeLockedWallet")),
            keccak256(bytes("1")),
            42,
            address(this)
    ));
            // 42, // Kovan 1337

    modifier onlyOwner { 
        require(msg.sender == owner);
        _;
    }

    constructor(address _creator, address _owner, uint256 _unlockDate) {
        creator = _creator;
        owner = _owner;
        unlockDate = _unlockDate;
        createdAt = block.timestamp;
    }

    // keep all the ether sent to this address
    fallback() payable external { 
        emit Received(msg.sender, msg.value);
    }

    // callable by owner only, after specified time
    function withdraw(address userAddress, bytes32 r, bytes32 s, uint8 v) public {
       require(block.timestamp >= unlockDate, "Amount not unlocked");

       MetaTransaction memory metaTx = MetaTransaction({
            nonce: nonces[userAddress],
            from: userAddress
        });

        bytes32 digest = keccak256(
            abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR,
                    keccak256(abi.encode(META_TRANSACTION_TYPEHASH, metaTx.nonce, metaTx.from))
                )
            );

        emit WithdrawAddress(ecrecover(digest, v, r, s));

        require(userAddress != address(0), "invalid-address-0");
        require(userAddress == owner, "Can only withraw to owner address");
        require(userAddress == ecrecover(digest, v, r, s), "invalid-signatures");

       //block.timestamp send all the balance
       payable(userAddress).transfer(address(this).balance);
       nonces[userAddress]++;
       emit Withdrew(userAddress, address(this).balance);
    }

    // callable by owner only, after specified time, only for Tokens implementing ERC20
    function withdrawTokens(address _tokenContract, address userAddress, bytes32 r, bytes32 s, uint8 v) public {
       require(block.timestamp >= unlockDate, "Amount not unlocked");

        MetaTransaction memory metaTx = MetaTransaction({
            nonce: nonces[userAddress],
            from: userAddress
        });

        bytes32 digest = keccak256(
            abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR,
                    keccak256(abi.encode(META_TRANSACTION_TYPEHASH, metaTx.nonce, metaTx.from))
                )
            );

        require(userAddress != address(0), "invalid-address-0");
        require(userAddress == owner, "Can only withraw to owner address");
        require(userAddress == ecrecover(digest, v, r, s), "invalid-signatures");

       ERC20 token = ERC20(_tokenContract);
       //block.timestamp send all the token balance
       uint256 tokenBalance = token.balanceOf(address(this));
       token.transfer(userAddress, tokenBalance);
       emit WithdrewTokens(_tokenContract, userAddress, tokenBalance);
    }

    function info() public view returns(address, address, uint256, uint256, uint256) {
        return (creator, owner, unlockDate, createdAt, address(this).balance);
    }

    event Received(address from, uint256 amount);
    event Withdrew(address to, uint256 amount);
    event WithdrewTokens(address tokenContract, address to, uint256 amount);
    event WithdrawAddress(address _recovered);
}
