// multiItemInfo.ts
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

let client_open_collection: any;
let client_open_item: any;

// Get the item information based on item id
router.get('/', async (req: Request, res: Response) => {
    try {
        const collection_contract = NftCollection.fromAddress(Address.parse(collection_addr))
        client_open_collection = client.open(collection_contract)
        const itemFrom = Number(req.query.itemFrom);
        const itemTo = Number(req.query.itemTo);
        const allItemInfo = [];
        for (let i = itemFrom; i <= itemTo; i++) {
            const item_address = await client_open_collection.getGetNftAddressByIndex(i)
            console.log(item_address)
            // const addrByItem = await detectAddress(item_address, "EQ")
            // console.log(addrByItem)
            const item_contract = NftItem.fromAddress(item_address)
            client_open_item = client.open(item_contract)
            const itemData = await client_open_item.getGetNftData()
            console.log(itemData.owner_address)
            const ownerByItem = await detectAddress(itemData.owner_address, "UQ")
            console.log(ownerByItem)
            allItemInfo.push({
                itemIndex: i.toString(),
                itemContract: item_address,
                itemOwner: ownerByItem
            })
        }
        console.log(allItemInfo)
        res.send(allItemInfo)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('Internal Server Error')
    }
});

export default router;
