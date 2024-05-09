// usersRoute.ts
import express, { Request, Response } from 'express';
const router = express.Router();

// 假设你有一个数据库模型或者一些数据
const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Alice' }
];

// 获取所有用户
router.get('/', (req: Request, res: Response) => {
    res.json(users);
});

// 获取单个用户
router.get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// 创建新用户
router.post('/', (req: Request, res: Response) => {
    const newUser = req.body;
    users.push(newUser);
    res.status(201).json(newUser);
});

export default router;
