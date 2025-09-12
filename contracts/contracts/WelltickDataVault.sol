// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract WelltickDataVault is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;
    
    struct DataRecord {
        string ipfsHash;
        string encryptedKey;
        uint256 timestamp;
        string dataType;
        bool isActive;
        mapping(address => bool) accessGranted;
        address[] authorizedUsers;
    }
    
    struct AccessRequest {
        address requester;
        string purpose;
        uint256 requestTime;
        uint256 duration;
        bool isPending;
        bool isApproved;
    }
    
    mapping(address => mapping(bytes32 => DataRecord)) private userRecords;
    mapping(address => bytes32[]) private userRecordIds;
    mapping(address => mapping(address => AccessRequest)) public accessRequests;
    mapping(address => address[]) public pendingRequests;
    
    event DataStored(address indexed user, bytes32 indexed recordId, string ipfsHash);
    event AccessGranted(address indexed owner, address indexed accessor, bytes32 indexed recordId);
    event AccessRevoked(address indexed owner, address indexed accessor, bytes32 indexed recordId);
    event AccessRequested(address indexed requester, address indexed owner, string purpose);
    event DataDeleted(address indexed user, bytes32 indexed recordId);
    
    modifier onlyRecordOwner(bytes32 recordId) {
        require(userRecords[msg.sender][recordId].timestamp > 0, "Record does not exist");
        _;
    }
    
    function storeHealthData(
        bytes32 recordId,
        string memory ipfsHash,
        string memory encryptedKey,
        string memory dataType
    ) external {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(userRecords[msg.sender][recordId].timestamp == 0, "Record already exists");
        
        DataRecord storage record = userRecords[msg.sender][recordId];
        record.ipfsHash = ipfsHash;
        record.encryptedKey = encryptedKey;
        record.timestamp = block.timestamp;
        record.dataType = dataType;
        record.isActive = true;
        
        userRecordIds[msg.sender].push(recordId);
        
        emit DataStored(msg.sender, recordId, ipfsHash);
    }
    
    function requestAccess(
        address dataOwner,
        string memory purpose,
        uint256 duration
    ) external {
        require(dataOwner != msg.sender, "Cannot request access to own data");
        require(!accessRequests[dataOwner][msg.sender].isPending, "Request already pending");
        
        accessRequests[dataOwner][msg.sender] = AccessRequest({
            requester: msg.sender,
            purpose: purpose,
            requestTime: block.timestamp,
            duration: duration,
            isPending: true,
            isApproved: false
        });
        
        pendingRequests[dataOwner].push(msg.sender);
        
        emit AccessRequested(msg.sender, dataOwner, purpose);
    }
    
    function grantAccess(
        address accessor,
        bytes32 recordId
    ) external onlyRecordOwner(recordId) {
        require(accessRequests[msg.sender][accessor].isPending, "No pending request");
        
        DataRecord storage record = userRecords[msg.sender][recordId];
        record.accessGranted[accessor] = true;
        record.authorizedUsers.push(accessor);
        
        accessRequests[msg.sender][accessor].isPending = false;
        accessRequests[msg.sender][accessor].isApproved = true;
        
        _removePendingRequest(accessor);
        
        emit AccessGranted(msg.sender, accessor, recordId);
    }
    
    function revokeAccess(
        address accessor,
        bytes32 recordId
    ) external onlyRecordOwner(recordId) {
        DataRecord storage record = userRecords[msg.sender][recordId];
        require(record.accessGranted[accessor], "Access not granted");
        
        record.accessGranted[accessor] = false;
        
        for (uint i = 0; i < record.authorizedUsers.length; i++) {
            if (record.authorizedUsers[i] == accessor) {
                record.authorizedUsers[i] = record.authorizedUsers[record.authorizedUsers.length - 1];
                record.authorizedUsers.pop();
                break;
            }
        }
        
        emit AccessRevoked(msg.sender, accessor, recordId);
    }
    
    function getHealthData(
        address dataOwner,
        bytes32 recordId
    ) external view returns (string memory ipfsHash, string memory dataType, uint256 timestamp) {
        require(
            dataOwner == msg.sender || 
            userRecords[dataOwner][recordId].accessGranted[msg.sender],
            "Access denied"
        );
        
        DataRecord storage record = userRecords[dataOwner][recordId];
        require(record.isActive, "Record is not active");
        
        return (record.ipfsHash, record.dataType, record.timestamp);
    }
    
    function getEncryptedKey(
        address dataOwner,
        bytes32 recordId
    ) external view returns (string memory) {
        require(
            dataOwner == msg.sender || 
            userRecords[dataOwner][recordId].accessGranted[msg.sender],
            "Access denied"
        );
        
        return userRecords[dataOwner][recordId].encryptedKey;
    }
    
    function getUserRecords(address user) external view returns (bytes32[] memory) {
        require(user == msg.sender, "Can only view own records");
        return userRecordIds[user];
    }
    
    function getPendingRequests() external view returns (address[] memory) {
        return pendingRequests[msg.sender];
    }
    
    function getAuthorizedUsers(bytes32 recordId) external view returns (address[] memory) {
        require(userRecords[msg.sender][recordId].timestamp > 0, "Record does not exist");
        return userRecords[msg.sender][recordId].authorizedUsers;
    }
    
    function deleteRecord(bytes32 recordId) external onlyRecordOwner(recordId) {
        userRecords[msg.sender][recordId].isActive = false;
        
        bytes32[] storage records = userRecordIds[msg.sender];
        for (uint i = 0; i < records.length; i++) {
            if (records[i] == recordId) {
                records[i] = records[records.length - 1];
                records.pop();
                break;
            }
        }
        
        emit DataDeleted(msg.sender, recordId);
    }
    
    function _removePendingRequest(address requester) internal {
        address[] storage pending = pendingRequests[msg.sender];
        for (uint i = 0; i < pending.length; i++) {
            if (pending[i] == requester) {
                pending[i] = pending[pending.length - 1];
                pending.pop();
                break;
            }
        }
    }
    
    function emergencyAccess(
        address patient,
        bytes32[] memory recordIds,
        bytes memory signature
    ) external view returns (string[] memory ipfsHashes) {
        bytes32 hash = keccak256(abi.encodePacked(patient, msg.sender, "EMERGENCY_ACCESS"));
        address signer = hash.toEthSignedMessageHash().recover(signature);
        require(signer == patient, "Invalid emergency access signature");
        
        ipfsHashes = new string[](recordIds.length);
        for (uint i = 0; i < recordIds.length; i++) {
            ipfsHashes[i] = userRecords[patient][recordIds[i]].ipfsHash;
        }
    }
}