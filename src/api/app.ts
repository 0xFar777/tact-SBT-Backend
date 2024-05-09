// app.ts
import express from 'express';
import bodyParser from 'body-parser';
import rootRouter from './routes/rootRoute'; 
import usersRouter from './routes/usersRoute'; 

// 创建 Express 应用
const app = express();
const PORT = process.env.PORT || 5173;   

// 使用 body-parser 中间件来解析请求体
app.use(bodyParser.json());

// 使用路由
app.use('/', rootRouter);
app.use('/api/users', usersRouter);

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
