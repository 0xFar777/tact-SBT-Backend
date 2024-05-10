// ownerBase64UrlByItemId.ts
import { Address, TonClient4 } from "@ton/ton";
import express, { Request, Response } from 'express';
import { detectAddress } from "../utils/detectAddress";
import { NftCollection } from "../../contracts/output/0xFar777-SBT_NftCollection";
import { NftItem } from "../../contracts/output/0xFar777-SBT_NftItem";

const router = express.Router();

const client = new TonClient4({
    endpoint: "https://mainnet-v4.tonhubapi.com", 
});
const collection_addr: string = "EQByEfh2nHqInBWd3T9Bty5PL_RUYcaNKwNfhRkUCaK6lG6s";

let client_open_collection : any;
let client_open_item: any;

// Get the holder address based on item id
router.get('/:itemId', async (req: Request, res: Response) => {
    try {
        const collection_contract = NftCollection.fromAddress(Address.parse(collection_addr))
        client_open_collection = client.open(collection_contract)
        const itemId = parseInt(req.params.itemId)
        const item_address = await client_open_collection.getGetNftAddressByIndex(itemId)
        console.log(item_address)
        const item_contract = NftItem.fromAddress(item_address)
        client_open_item = client.open(item_contract)
        const itemData = await client_open_item.getGetNftData()
        console.log(itemData.owner_address)
        const ownerByItem = await detectAddress(itemData.owner_address, "UQ")
        console.log(ownerByItem)
        res.send(ownerByItem)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('Internal Server Error')
    }
});

export default router;
