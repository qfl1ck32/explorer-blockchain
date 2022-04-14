pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ExplorerToken is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    constructor() ERC721("Explorer", "EXP") {}

    function createToken() external onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newLocationId = _tokenIds.current();
        _safeMint(this.owner(), newLocationId);

        return newLocationId;
    }
}

contract ExplorerSupply is ERC1155, IERC721Receiver, Ownable {
    address NFT;

    constructor() ERC1155("") {
        ExplorerToken _NFT = new ExplorerToken();
        NFT = address(_NFT);
    }

    function ownedToken() view external returns (address _NFT)
    {
        return NFT;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4)
    {
        _mint(this.owner(), tokenId, 128, data);
        return IERC721Receiver.onERC721Received.selector;
    }

    function createToken() public onlyOwner returns (uint) {
        ExplorerToken(NFT).createToken();

        return 0;
    }
}