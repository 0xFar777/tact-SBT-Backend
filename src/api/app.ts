// app.ts
import express from 'express';
import cluster from 'cluster';
import os from 'os';
import bodyParser from 'body-parser';
import rootRouter from './routes/rootRoute'; 
import itemAmountRouter from './routes/itemAmount';
import ownerBase64UrlByItemIdRouter from './routes/ownerBase64UrlByItemId';
import ownerBase64UrlByItemAddrRouter from './routes/ownerBase64UrlByItemAddr';
import multiItemInfoRouter from "./routes/multiItemInfo"

const numCPUs = os.cpus().length;

// Start the multi-process cluster module
if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // create Express
  const app = express();
  const PORT = process.env.PORT || 5173;

  // CORS middleware
  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  // Use body-parser middleware to parse the request body
  app.use(bodyParser.json());

  // use router
  app.use('/', rootRouter);
  app.use('/api/itemAmount', itemAmountRouter)
  app.use('/api/ownerBase64UrlByItemId', ownerBase64UrlByItemIdRouter)
  app.use('/api/ownerBase64UrlByItemAddr', ownerBase64UrlByItemAddrRouter)
  app.use('/api/multiItemInfo', multiItemInfoRouter)

  // start run server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
}
