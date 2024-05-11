// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract CarInsuranceContract {
    address public owner;
    
    struct Policy {
        uint256 policyId;
        address carOwner;
        uint256 premiumAmount;
        uint256 coverageAmount;
        uint256 purchaseTimestamp;
        uint256 expirationTimestamp;
        bool isClaimed;
        bool isPremiumPaid; // premium payment status
    }

    mapping(uint256 => Policy) public policies;
    uint256 public policyCounter;

    event PolicyPurchased(uint256 indexed policyId, address indexed carOwner);
    event ClaimFiled(uint256 indexed policyId, address indexed carOwner, uint256 claimAmount);
    event PolicyExpired(uint256 indexed policyId, address indexed carOwner);
    event PremiumPaid(uint256 indexed policyId, address indexed carOwner, uint256 amount);

    modifier onlyPolicyOwner(uint256 _policyId) {
        require(msg.sender == policies[_policyId].carOwner, "Only the car owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        // Handle the incoming Ether
    }


    function purchaseInsurance(uint256 _premiumAmount, uint256 _coverageAmount, uint256 _durationInMonths) external {
        require(_premiumAmount > 0, "Premium amount must be greater than 0");
        require(_coverageAmount > 0, "Coverage amount must be greater than 0");

        uint256 expirationTimestamp = block.timestamp + (_durationInMonths * 30 days);

        Policy storage newPolicy = policies[policyCounter];
        newPolicy.policyId = policyCounter;
        newPolicy.carOwner = msg.sender;
        newPolicy.premiumAmount = _premiumAmount;
        newPolicy.coverageAmount = _coverageAmount;
        newPolicy.purchaseTimestamp = block.timestamp;
        newPolicy.expirationTimestamp = expirationTimestamp;

        emit PolicyPurchased(policyCounter, msg.sender);
        
        policyCounter++;
    }

    function fileClaim(uint256 _policyId, uint256 _claimAmount) external onlyPolicyOwner(_policyId) {
        Policy storage policy = policies[_policyId];
        //require(policy.carOwner != address(0), "Policy does not exist");
        require(!policy.isClaimed, "Claim has already been filed for this policy");
        require(block.timestamp <= policy.expirationTimestamp, "Policy has expired");

        policy.isClaimed = true;

        // Transfer the claimed amount to the policy owner
        payable(policy.carOwner).transfer(_claimAmount);

        emit ClaimFiled(_policyId, policy.carOwner, _claimAmount);
    }

    function processPremiumPayment(uint256 _policyId) external payable {
        Policy storage policy = policies[_policyId];
        require(policy.carOwner != address(0), "Policy does not exist");
        require(block.timestamp <= policy.expirationTimestamp, "Policy has expired");
        require(msg.value == policy.premiumAmount, "Incorrect premium amount");
        // Update premium payment status to true
        policy.isPremiumPaid = true;
        
        emit PremiumPaid(_policyId, policy.carOwner, msg.value);
    }

}
