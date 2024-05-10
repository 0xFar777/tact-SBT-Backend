// itemAmount.ts
import { Address, TonClient4 } from "@ton/ton";
import express, { Request, Response } from 'express';
import { NftCollection } from "../../contracts/output/0xFar777-SBT_NftCollection";

const router = express.Router();

const client = new TonClient4({
    endpoint: "https://mainnet-v4.tonhubapi.com", 
});
const collection_addr: string = "EQByEfh2nHqInBWd3T9Bty5PL_RUYcaNKwNfhRkUCaK6lG6s";

let client_open_collection : any;

// Get item amount
router.get('/', async (req: Request, res: Response) => {
    try {
        const collection_contract = NftCollection.fromAddress(Address.parse(collection_addr))
        client_open_collection = client.open(collection_contract)
        const collection_data = await client_open_collection.getGetCollectionData()
        console.log(collection_data.next_item_index)
        res.send(collection_data.next_item_index.toString())
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('Internal Server Error')
    }
});

export default router;
