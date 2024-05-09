// rootRoute.ts
import express, { Request, Response } from 'express';
const router = express.Router();

// 定义根路由
router.get('/', (req: Request, res: Response) => {
    res.send('Welcome!');
});

export default router;
