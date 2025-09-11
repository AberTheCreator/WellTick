// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WelltickIdentity is ERC721, Ownable {
    uint256 public nextId;
    mapping(address => string) public metadataURIs;

    constructor() ERC721("WelltickCredential", "WTCRED") {}

    function mintCredential(address to, string memory metadataURI) public onlyOwner {
        _safeMint(to, nextId);
        metadataURIs[to] = metadataURI;
        nextId++;
    }

    function getMetadataURI(address user) public view returns (string memory) {
        return metadataURIs[user];
    }
}