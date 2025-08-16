const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("MarketZap", function () {
  let marketZap;
  let owner, user1, user2;
  let mockRouter, mockPositionManager, mockFarmingCenter;
  let mockCollateral, mockOutcome1, mockOutcome2;
  let mockMarket, mockPool1, mockPool2;
  
  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy mock contracts
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockCollateral = await MockERC20.deploy("Mock Collateral", "COLL", 18);
    mockOutcome1 = await MockERC20.deploy("Outcome 1", "OUT1", 18);
    mockOutcome2 = await MockERC20.deploy("Outcome 2", "OUT2", 18);
    
    const MockRouter = await ethers.getContractFactory("MockRouter");
    mockRouter = await MockRouter.deploy();
    
    const MockPositionManager = await ethers.getContractFactory("MockPositionManager");
    mockPositionManager = await MockPositionManager.deploy();
    
    const MockFarmingCenter = await ethers.getContractFactory("MockFarmingCenter");
    mockFarmingCenter = await MockFarmingCenter.deploy();
    
    const MockMarket = await ethers.getContractFactory("MockMarket");
    mockMarket = await MockMarket.deploy();
    
    const MockPool = await ethers.getContractFactory("MockAlgebraPool");
    mockPool1 = await MockPool.deploy(
      mockOutcome1.address,
      mockCollateral.address
    );
    mockPool2 = await MockPool.deploy(
      mockOutcome2.address,
      mockCollateral.address
    );
    
    // Deploy MarketZap
    const MarketZap = await ethers.getContractFactory("MarketZap");
    marketZap = await MarketZap.deploy(
      mockRouter.address,
      mockPositionManager.address,
      mockFarmingCenter.address
    );
    
    // Setup initial balances
    await mockCollateral.mint(user1.address, ethers.utils.parseEther("1000"));
    await mockCollateral.connect(user1).approve(
      marketZap.address,
      ethers.constants.MaxUint256
    );
  });
  
  describe("Deployment", function () {
    it("Should set the correct addresses", async function () {
      expect(await marketZap.router()).to.equal(mockRouter.address);
      expect(await marketZap.positionManager()).to.equal(mockPositionManager.address);
      expect(await marketZap.farmingCenter()).to.equal(mockFarmingCenter.address);
    });
    
    it("Should set the correct owner", async function () {
      expect(await marketZap.owner()).to.equal(owner.address);
    });
    
    it("Should set default parameters", async function () {
      expect(await marketZap.safetyFactor()).to.equal(9800);
      expect(await marketZap.defaultSlippageBps()).to.equal(50);
    });
  });
  
  describe("zapIntoMarket", function () {
    it("Should revert with zero collateral amount", async function () {
      const params = {
        market: mockMarket.address,
        collateralToken: mockCollateral.address,
        collateralAmount: 0,
        pools: [mockPool1.address],
        farms: [],
        minLiquidities: [0],
        deadline: Math.floor(Date.now() / 1000) + 3600
      };
      
      await expect(
        marketZap.connect(user1).zapIntoMarket(params)
      ).to.be.revertedWith("Zero collateral amount");
    });
    
    it("Should revert with no pools", async function () {
      const params = {
        market: mockMarket.address,
        collateralToken: mockCollateral.address,
        collateralAmount: ethers.utils.parseEther("100"),
        pools: [],
        farms: [],
        minLiquidities: [],
        deadline: Math.floor(Date.now() / 1000) + 3600
      };
      
      await expect(
        marketZap.connect(user1).zapIntoMarket(params)
      ).to.be.revertedWithCustomError(marketZap, "NoPoolsProvided");
    });
    
    it("Should revert with mismatched array lengths", async function () {
      const params = {
        market: mockMarket.address,
        collateralToken: mockCollateral.address,
        collateralAmount: ethers.utils.parseEther("100"),
        pools: [mockPool1.address, mockPool2.address],
        farms: [],
        minLiquidities: [0], // Wrong length
        deadline: Math.floor(Date.now() / 1000) + 3600
      };
      
      await expect(
        marketZap.connect(user1).zapIntoMarket(params)
      ).to.be.revertedWithCustomError(marketZap, "ArrayLengthMismatch");
    });
    
    it("Should revert after deadline", async function () {
      const params = {
        market: mockMarket.address,
        collateralToken: mockCollateral.address,
        collateralAmount: ethers.utils.parseEther("100"),
        pools: [mockPool1.address],
        farms: [],
        minLiquidities: [0],
        deadline: Math.floor(Date.now() / 1000) - 1 // Past deadline
      };
      
      await expect(
        marketZap.connect(user1).zapIntoMarket(params)
      ).to.be.revertedWithCustomError(marketZap, "DeadlineExpired");
    });
    
    // Add more comprehensive tests for successful zaps
  });
  
  describe("calculateOptimalSplit", function () {
    it("Should calculate correct split amount", async function () {
      const totalAmount = ethers.utils.parseEther("100");
      const pools = [mockPool1.address, mockPool2.address];
      
      const splitAmount = await marketZap.calculateOptimalSplit(
        mockCollateral.address,
        pools,
        totalAmount
      );
      
      // With default 98% safety factor and 2 pools with 1:1 ratio
      // splitAmount should be approximately 32.67 (100 / 3 * 0.98)
      const expectedSplit = totalAmount.mul(9800).div(30000); // (1 + 2) * 10000
      expect(splitAmount).to.be.closeTo(expectedSplit, ethers.utils.parseEther("1"));
    });
  });
  
  describe("Admin functions", function () {
    it("Should allow owner to set safety factor", async function () {
      await expect(marketZap.setSafetyFactor(9500))
        .to.emit(marketZap, "SafetyFactorUpdated")
        .withArgs(9800, 9500);
        
      expect(await marketZap.safetyFactor()).to.equal(9500);
    });
    
    it("Should not allow non-owner to set safety factor", async function () {
      await expect(
        marketZap.connect(user1).setSafetyFactor(9500)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    
    it("Should allow owner to pause", async function () {
      await marketZap.pause();
      expect(await marketZap.paused()).to.be.true;
      
      const params = {
        market: mockMarket.address,
        collateralToken: mockCollateral.address,
        collateralAmount: ethers.utils.parseEther("100"),
        pools: [mockPool1.address],
        farms: [],
        minLiquidities: [0],
        deadline: Math.floor(Date.now() / 1000) + 3600
      };
      
      await expect(
        marketZap.connect(user1).zapIntoMarket(params)
      ).to.be.revertedWith("Pausable: paused");
    });
    
    it("Should allow owner to unpause", async function () {
      await marketZap.pause();
      await marketZap.unpause();
      expect(await marketZap.paused()).to.be.false;
    });
  });
  
  describe("Emergency functions", function () {
    it("Should allow owner to recover tokens", async function () {
      // Send tokens to contract
      await mockCollateral.mint(marketZap.address, ethers.utils.parseEther("10"));
      
      const balanceBefore = await mockCollateral.balanceOf(owner.address);
      await marketZap.recoverToken(
        mockCollateral.address,
        ethers.utils.parseEther("10")
      );
      const balanceAfter = await mockCollateral.balanceOf(owner.address);
      
      expect(balanceAfter.sub(balanceBefore)).to.equal(ethers.utils.parseEther("10"));
    });
    
    it("Should not allow non-owner to recover tokens", async function () {
      await expect(
        marketZap.connect(user1).recoverToken(
          mockCollateral.address,
          ethers.utils.parseEther("10")
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});

// Mock contracts for testing
// In production, these would be separate files in contracts/seerswap/mocks/

/*
contract MockERC20 {
    // Basic ERC20 implementation
}

contract MockRouter {
    function splitPosition(address, address, uint256) external {
        // Mock implementation
    }
}

contract MockPositionManager {
    function mint(MintParams calldata) external returns (uint256, uint128, uint256, uint256) {
        // Mock implementation
    }
}

contract MockFarmingCenter {
    function enterFarming(IncentiveKey memory, uint256, uint256) external {
        // Mock implementation
    }
}

contract MockAlgebraPool {
    function globalState() external view returns (uint160, int24, uint16, uint16, uint8, uint8, bool) {
        // Mock implementation
    }
    
    function tickSpacing() external view returns (int24) {
        return 60;
    }
    
    function token0() external view returns (address);
    function token1() external view returns (address);
}

contract MockMarket {
    function wrappedOutcome(uint256) external view returns (address, bytes memory) {
        // Mock implementation
    }
}
*/