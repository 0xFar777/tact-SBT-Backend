import { beginCell, contractAddress, toNano, Cell, Address, TonClient4 } from "@ton/ton";
import { deploy } from "../contracts/utils/deploy";
import { printAddress, printDeploy, printHeader } from "../contracts/utils/print";
// ================================================================= //
import { NftCollection } from "../contracts/output/0xFar777-SBT_NftCollection";
// ================================================================= //

(async () => {
    const client = new TonClient4({
        endpoint: "https://mainnet-v4.tonhubapi.com", 
        // endpoint: "https://sandbox-v4.tonhubapi.com",
    });

    // Parameters
    let collection_address = Address.parse("kQCBGFujMr0VFrfZTJYVmd7_8-RNgVTTcLnuxhKh6dqZNFiJ");

    let contract_address = await NftCollection.fromAddress(collection_address);
    let client_open = client.open(contract_address);

    const nft_index = 0n;
    let collection_data = await client_open.getGetCollectionData();
    printHeader("0xFar777-SBT Contract");
    // printAddress(collection_address
    // printHeader("1234");
    console.log("NFT ID[" + nft_index + "]: " + collection_data.collection_content.asSlice());
    console.log("NFT ID[" + nft_index + "]: " + collection_data.owner_address);
    console.log("NFT ID[" + nft_index + "]: " + collection_data.next_item_index);
})();
