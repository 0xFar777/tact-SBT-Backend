// ownerBase64UrlByItemAddr.ts
import { Address, TonClient4 } from "@ton/ton";
import express, { Request, Response } from 'express';
import { detectAddress } from "../utils/detectAddress";
import { NftItem } from "../../contracts/output/0xFar777-SBT_NftItem";

const router = express.Router();

const client = new TonClient4({
    endpoint: "https://mainnet-v4.tonhubapi.com", 
});

let client_open_item: any;

// Get the holder address based on item contractAddr
router.get('/:itemAddr', async (req: Request, res: Response) => {
    try {
        const item_address = req.params.itemAddr
        console.log(item_address)
        const item_contract = NftItem.fromAddress(Address.parse(item_address))
        client_open_item = client.open(item_contract);
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
