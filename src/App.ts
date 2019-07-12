import bodyParser from 'body-parser';
import express from 'express';
import inventoryRouter from './routers/inventory-router';
import { closePool } from './util/pg-connector';

// Setup Express
const app = express();

// process
const port = process.env.port || 3000;

// Close the pool when app shuts down
process.on('SIGINT', async () => {
    await closePool();
});

// Register middleware
app.use(bodyParser.json());

// Register routers
app.use('/inventory', inventoryRouter);

// Open port
app.listen(port, () => {
    console.log(`Application running on port ${port}.`);
});
