import { beginCell, contractAddress, Address } from "@ton/ton";
import { toNano } from '@ton/core';
import { deploy } from "../contracts/utils/deploy";
import { printAddress, printHeader } from "../contracts/utils/print";
// ================================================================= //
import { NftCollection } from "../contracts/output/0xFar777-SBT_NftCollection";
// ================================================================= //

(async () => {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const contentURI = "https://file123456.4everland.store/metadata.json"; 
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(contentURI).endCell();

    // ===== Parameters =====
    let owner = Address.parse("UQB63jOxnW1UjaDnhpF97b7JJviSK2A2cFRQIew3maKYhvZ_"); 

    // Prepare the initial code and data for the contract
    let init = await NftCollection.init(owner, newContent, {
        $$type: "RoyaltyParams",
        numerator: 100n, // 100n = 10%
        denominator: 1000n,
        destination: owner,
    });

    let deployAmount = toNano("0.15");
    let body = beginCell().storeUint(0, 32).storeStringTail("Mint").endCell();
    let testnet = false;

    let address = contractAddress(0, init);
    console.log(address);
    // Do deploy
    await deploy(init, deployAmount, body, testnet);
    printHeader("0xFar777-SBT Contract");
    printAddress(address);
})();

