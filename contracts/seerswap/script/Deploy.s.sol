// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/Zap.sol";

contract DeployScript is Script {
    // Gnosis addresses
    address constant GNOSIS_ROUTER = 0xeC9048b59b3467415b1a38F63416407eA0c70fB8;
    address constant GNOSIS_POSITION_MANAGER = 0x91fD594c46D8B01E62dBDeBed2401dde01817834;
    address constant GNOSIS_FARMING_CENTER = 0xDe51dDF1aE7d5BBD7bF1A0e40aAA1F6C12579106;
    address constant REWARD_TOKEN = 0xa7A7F8D1770C08E2E1f55D8C6427C1F8213A34dA;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Zap
        Zap zap = new Zap(
            GNOSIS_ROUTER,
            GNOSIS_POSITION_MANAGER,
            GNOSIS_FARMING_CENTER,
            REWARD_TOKEN // No default reward token
        );

        console.log("MarketZapSimple deployed to:", address(zap));

        vm.stopBroadcast();
    }
}