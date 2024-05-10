import { beginCell, contractAddress, toNano, Cell, Address, TonClient4 } from "@ton/ton";
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
    let collection_address = Address.parse("EQByEfh2nHqInBWd3T9Bty5PL_RUYcaNKwNfhRkUCaK6lG6s");

    let contract_address = await NftCollection.fromAddress(collection_address);
    let client_open = client.open(contract_address);

    const nft_index = 0n;
    let collection_data = await client_open.getGetCollectionData();
    printHeader("0xFar777-SBT Contract");
    await fetch(`https://toncenter.com/api/v2/unpackAddress?address=${collection_data.owner_address}`).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        console.log(data);
    }).catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
    printAddress(collection_address)
    console.log(collection_data.collection_content.asSlice());
    console.log(collection_data.owner_address);
    console.log(collection_data.next_item_index);
})();
