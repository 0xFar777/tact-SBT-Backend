import {
    Address,
    beginCell,
    contractAddress,
    toNano,
    TonClient4,
    internal,
    fromNano,
    WalletContractV4,
} from "@ton/ton";
import { deploy } from "../contracts/utils/deploy";
import { printAddress, printDeploy, printHeader, printSeparator } from "../contracts/utils/print";
import { mnemonicToPrivateKey } from "@ton/crypto";
import * as dotenv from "dotenv";
dotenv.config();
// ================================================================= //
import { NftCollection } from "../contracts/output/0xFar777-SBT_NftCollection";
import { NftItem } from "../contracts/output/0xFar777-SBT_NftItem";
// ================================================================= //

(async () => {
    // Create client for testnet sandboxv4 API - alternative endpoint
    const client4 = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com", // Test-net
    });
    console.log(NftItem)

    // Parameters for NFTs
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const contentURI = "https://file123456.4everland.store/metadata.json"; 
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(contentURI).endCell();

    let mnemonics = (process.env.mnemonics_2 || "").toString(); 
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0;
    let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    let wallet_contract = client4.open(wallet);
    console.log("Wallet address: ", wallet_contract.address);

    // Replace owner with your address
    let owner = wallet.address;

    // Prepare the initial code and data for the contract
    let init = await NftCollection.init(owner, newContent, {
        $$type: "RoyaltyParams",
        numerator: 100n, // 100n = 10%
        denominator: 1000n,
        destination: owner,
    });
    let deployContract = contractAddress(0, init);
    console.log(deployContract)
    // ========================================
    let packed = beginCell().storeUint(0, 32).storeStringTail("Mint").endCell();
    // ========================================
    let deployAmount = toNano("0.3");
    let seqno: number = await wallet_contract.getSeqno();
    let balance: bigint = await wallet_contract.getBalance();
    // ========================================
    console.log("Current deployment wallet balance: ", fromNano(balance).toString(), "💎TON");
    printSeparator();
    console.log("Deploying contract to address: ", deployContract);
    await wallet_contract.sendTransfer({
        seqno,
        secretKey,
        messages: [
            internal({
                to: deployContract,
                value: deployAmount,
                init: { code: init.code, data: init.data },
                bounce: true,
                body: packed,
            }),
        ],
    });

    let collection_client = client4.open(NftCollection.fromAddress(deployContract));
    let latest_indexId = (await collection_client.getGetCollectionData()).next_item_index;
    console.log("Latest indexID:[", latest_indexId, "]");
    let item_address = await collection_client.getGetNftAddressByIndex(latest_indexId);
    console.log("Minting NFT Item: ", item_address);
})();
