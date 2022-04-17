pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ExplorerToken is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Location {
        int24 latitude;
        int24 longitude;
        string name;
    }

    mapping(int24 => mapping(int24 => bool)) _coords;

    mapping(uint256 => Location) _places;

    constructor() ERC721("Explorer", "EXP") {}

    function createToken(
        int24 latitude,
        int24 longitude,
        string memory name
    ) external onlyOwner returns (uint256) {
        require(
            _coords[latitude][longitude] == false,
            "This location has already been registered!"
        );
        
        _tokenIds.increment();
        uint256 locationId = _tokenIds.current();
        _safeMint(this.owner(), locationId);
        _places[locationId] = Location(latitude, longitude, name);
        _coords[latitude][longitude] = true;
        return locationId;
    }

    function getLocation(uint256 tokenId)
        public
        view
        returns (Location memory)
    {
        _exists(tokenId);
        return _places[tokenId];
    }
}

contract ExplorerSupply is ERC1155, IERC721Receiver, Ownable {
    address NFT;

    constructor() ERC1155("") {
        ExplorerToken _NFT = new ExplorerToken();
        NFT = address(_NFT);
    }

    function ownedToken() external view returns (address _NFT) {
        return NFT;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        _mint(this.owner(), tokenId, 128, data);
        return IERC721Receiver.onERC721Received.selector;
    }

    function createToken(
        int24 latitude,
        int24 longitude,
        string memory name
    ) public onlyOwner returns (uint256) {
        ExplorerToken(NFT).createToken(latitude, longitude, name);
        return 0;
    }
}
