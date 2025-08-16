// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Test.sol";
import "../src/MarketZapSimple.sol";

contract MarketZapSimpleTest is Test {
    MarketZapSimple public zap;
    
    address constant ROUTER = address(0x1);
    address constant POSITION_MANAGER = address(0x2);
    address constant FARMING_CENTER = address(0x3);
    
    function setUp() public {
        zap = new MarketZapSimple(ROUTER, POSITION_MANAGER, FARMING_CENTER);
    }
    
    function testDeployment() public {
        assertEq(address(zap.router()), ROUTER);
        assertEq(address(zap.positionManager()), POSITION_MANAGER);
        assertEq(address(zap.farmingCenter()), FARMING_CENTER);
        assertEq(zap.owner(), address(this));
    }
    
    function testZapRevertsWithoutWhitelist() public {
        address market = address(0x100);
        address collateral = address(0x200);
        address pool = address(0x300);
        
        address[] memory pools = new address[](1);
        pools[0] = pool;
        
        uint256[] memory minLiquidities = new uint256[](1);
        minLiquidities[0] = 100;
        
        address[] memory rewardTokens = new address[](1);
        rewardTokens[0] = address(0);
        
        uint256[] memory endTimes = new uint256[](1);
        endTimes[0] = 0;
        
        // Should revert because pool is not whitelisted
        vm.expectRevert(MarketZapSimple.InvalidPool.selector);
        zap.zap(
            market,
            collateral,
            1000,
            pools,
            minLiquidities,
            50, // 0.5% slippage
            block.timestamp + 3600,
            rewardTokens,
            endTimes
        );
    }
    
    function testZapRevertsOnDeadline() public {
        address market = address(0x100);
        address collateral = address(0x200);
        address pool = address(0x300);
        
        address[] memory pools = new address[](1);
        pools[0] = pool;
        
        uint256[] memory minLiquidities = new uint256[](1);
        minLiquidities[0] = 100;
        
        address[] memory rewardTokens = new address[](1);
        rewardTokens[0] = address(0);
        
        uint256[] memory endTimes = new uint256[](1);
        endTimes[0] = 0;
        
        // Should revert because deadline has passed
        vm.expectRevert(MarketZapSimple.DeadlineExpired.selector);
        zap.zap(
            market,
            collateral,
            1000,
            pools,
            minLiquidities,
            50,
            block.timestamp - 1, // Deadline in the past
            rewardTokens,
            endTimes
        );
    }
    
    function testOnERC721Received() public {
        bytes4 selector = zap.onERC721Received(address(0), address(0), 0, "");
        assertEq(selector, MarketZapSimple.onERC721Received.selector);
    }
}