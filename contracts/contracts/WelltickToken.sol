// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract WelltickToken is ERC20, Ownable, Pausable {
    
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    uint256 public constant DAILY_REWARD_POOL = 10000 * 10**18; // 10k tokens per day
    
    struct RewardActivity {
        uint256 postReward;
        uint256 helpfulReplyReward;
        uint256 locationReviewReward;
        uint256 dataContributionReward;
        uint256 rehabProgressReward;
    }
    
    struct UserStats {
        uint256 postsCreated;
        uint256 helpfulReplies;
        uint256 locationsReviewed;
        uint256 dataContributions;
        uint256 rehabSessions;
        uint256 totalEarned;
        uint256 lastRewardClaim;
    }
    
    RewardActivity public rewards = RewardActivity({
        postReward: 10 * 10**18,        // 10 tokens per helpful post
        helpfulReplyReward: 5 * 10**18,  // 5 tokens per helpful reply
        locationReviewReward: 15 * 10**18, // 15 tokens per location review
        dataContributionReward: 25 * 10**18, // 25 tokens per data contribution
        rehabProgressReward: 20 * 10**18  // 20 tokens per rehab milestone
    });
    
    mapping(address => UserStats) public userStats;
    mapping(address => bool) public authorizedRewarders;
    mapping(bytes32 => bool) public processedActivities;
    
    uint256 public totalDistributed;
    uint256 public communityPool;
    
    event RewardEarned(address indexed user, uint256 amount, string activityType);
    event CommunityContribution(address indexed contributor, uint256 amount);
    event RewardPoolRefilled(uint256 amount);
    
    constructor() ERC20("WelltickToken", "WELL") {
        _mint(owner(), MAX_SUPPLY * 20 / 100); // 20% to owner for initial distribution
        communityPool = MAX_SUPPLY * 80 / 100; // 80% for community rewards
        authorizedRewarders[owner()] = true;
    }
    
    modifier onlyAuthorizedRewarder() {
        require(authorizedRewarders[msg.sender], "Not authorized to distribute rewards");
        _;
    }
    
    function rewardUser(
        address user,
        string memory activityType,
        bytes32 activityId
    ) external onlyAuthorizedRewarder whenNotPaused {
        require(!processedActivities[activityId], "Activity already rewarded");
        require(user != address(0), "Invalid user address");
        
        uint256 rewardAmount = _getRewardAmount(activityType);
        require(rewardAmount > 0, "Invalid activity type");
        require(communityPool >= rewardAmount, "Insufficient reward pool");
        
        processedActivities[activityId] = true;
        communityPool -= rewardAmount;
        totalDistributed += rewardAmount;
        
        _updateUserStats(user, activityType);
        userStats[user].totalEarned += rewardAmount;
        
        _mint(user, rewardAmount);
        
        emit RewardEarned(user, rewardAmount, activityType);
    }
    
    function rewardMultipleUsers(
        address[] memory users,
        string[] memory activityTypes,
        bytes32[] memory activityIds
    ) external onlyAuthorizedRewarder whenNotPaused {
        require(users.length == activityTypes.length && users.length == activityIds.length, "Array length mismatch");
        
        for (uint i = 0; i < users.length; i++) {
            if (!processedActivities[activityIds[i]] && users[i] != address(0)) {
                uint256 rewardAmount = _getRewardAmount(activityTypes[i]);
                if (rewardAmount > 0 && communityPool >= rewardAmount) {
                    processedActivities[activityIds[i]] = true;
                    communityPool -= rewardAmount;
                    totalDistributed += rewardAmount;
                    
                    _updateUserStats(users[i], activityTypes[i]);
                    userStats[users[i]].totalEarned += rewardAmount;
                    
                    _mint(users[i], rewardAmount);
                    
                    emit RewardEarned(users[i], rewardAmount, activityTypes[i]);
                }
            }
        }
    }
    
    function claimDailyReward() external whenNotPaused {
        UserStats storage stats = userStats[msg.sender];
        require(block.timestamp >= stats.lastRewardClaim + 1 days, "Daily reward already claimed");
        
        uint256 dailyAmount = _calculateDailyReward(msg.sender);
        require(dailyAmount > 0, "No daily reward available");
        require(communityPool >= dailyAmount, "Insufficient reward pool");
        
        stats.lastRewardClaim = block.timestamp;
        communityPool -= dailyAmount;
        totalDistributed += dailyAmount;
        stats.totalEarned += dailyAmount;
        
        _mint(msg.sender, dailyAmount);
        
        emit RewardEarned(msg.sender, dailyAmount, "daily_bonus");
    }
    
    function contributeToPool() external payable {
        require(msg.value > 0, "Must contribute ETH");
        
        uint256 tokenAmount = msg.value * 1000; // 1 ETH = 1000 WELL tokens
        require(communityPool + tokenAmount <= MAX_SUPPLY, "Would exceed max supply");
        
        communityPool += tokenAmount;
        
        emit CommunityContribution(msg.sender, tokenAmount);
    }
    
    function _getRewardAmount(string memory activityType) internal view returns (uint256) {
        bytes32 activityHash = keccak256(abi.encodePacked(activityType));
        
        if (activityHash == keccak256(abi.encodePacked("post"))) {
            return rewards.postReward;
        } else if (activityHash == keccak256(abi.encodePacked("reply"))) {
            return rewards.helpfulReplyReward;
        } else if (activityHash == keccak256(abi.encodePacked("review"))) {
            return rewards.locationReviewReward;
        } else if (activityHash == keccak256(abi.encodePacked("data_contribution"))) {
            return rewards.dataContributionReward;
        } else if (activityHash == keccak256(abi.encodePacked("rehab_progress"))) {
            return rewards.rehabProgressReward;
        }
        
        return 0;
    }
    
    function _updateUserStats(address user, string memory activityType) internal {
        bytes32 activityHash = keccak256(abi.encodePacked(activityType));
        UserStats storage stats = userStats[user];
        
        if (activityHash == keccak256(abi.encodePacked("post"))) {
            stats.postsCreated++;
        } else if (activityHash == keccak256(abi.encodePacked("reply"))) {
            stats.helpfulReplies++;
        } else if (activityHash == keccak256(abi.encodePacked("review"))) {
            stats.locationsReviewed++;
        } else if (activityHash == keccak256(abi.encodePacked("data_contribution"))) {
            stats.dataContributions++;
        } else if (activityHash == keccak256(abi.encodePacked("rehab_progress"))) {
            stats.rehabSessions++;
        }
    }
    
    function _calculateDailyReward(address user) internal view returns (uint256) {
        UserStats memory stats = userStats[user];
        
        uint256 baseReward = 1 * 10**18; // 1 token base
        uint256 activityMultiplier = stats.postsCreated + stats.helpfulReplies + 
                                   stats.locationsReviewed + stats.dataContributions;
        
        if (activityMultiplier > 10) {
            activityMultiplier = 10; // Cap at 10x multiplier
        }
        
        return baseReward * (1 + activityMultiplier);
    }
    
    function updateRewards(
        uint256 _postReward,
        uint256 _replyReward,
        uint256 _reviewReward,
        uint256 _dataReward,
        uint256 _rehabReward
    ) external onlyOwner {
        rewards = RewardActivity({
            postReward: _postReward,
            helpfulReplyReward: _replyReward,
            locationReviewReward: _reviewReward,
            dataContributionReward: _dataReward,
            rehabProgressReward: _rehabReward
        });
    }
    
    function setAuthorizedRewarder(address rewarder, bool authorized) external onlyOwner {
        authorizedRewarders[rewarder] = authorized;
    }
    
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function getUserStats(address user) external view returns (UserStats memory) {
        return userStats[user];
    }
    
    function getRewardPool() external view returns (uint256) {
        return communityPool;
    }
    
    receive() external payable {
        contributeToPool();
    }
}