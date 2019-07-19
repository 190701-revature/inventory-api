import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import inventoryRouter from './routers/inventory-router';
import { closePool } from './util/pg-connector';
import userRouter from './routers/user-router';

// Setup Express
const app = express();

// process
const port = process.env.port || 3000;

// Register middleware
app.use(bodyParser.json());

app.use(session({
    resave: false,
    saveUnitialized: true,
    secret: 'my-secret',
}));

// Register routers
app.use('/inventory', inventoryRouter);
app.use('/users', userRouter);

// Open port
app.listen(port, () => {
    console.log(`Application running on port ${port}.`);
});
