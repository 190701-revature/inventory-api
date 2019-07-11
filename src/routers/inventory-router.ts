import express, { Request, Response } from 'express';
import Inventory from '../models/Inventory';
import * as inventoryService from '../services/inventory-service';

const inventoryRouter = express.Router();

inventoryRouter.post('',
    (request: Request, response: Response) => {
        const inventory = new Inventory(request.body);

        inventoryService.createInventory(inventory)
            // This handler receives the row data
            // from the service method
            .then((rows) => {
                if (rows.length > 0) {
                    response.status(201).json(rows[0]);
                } else {
                    response.sendStatus(400);
                }
            });
    });

inventoryRouter.get('/:id',
    async (request: Request, response: Response) => {
        const id = parseInt(request.params.id);

        const item: Inventory = await inventoryService.getInventoryById(id);

        if (item.id) {
            response.status(200).json(item);
        } else {
            response.sendStatus(404);
        }

    });

inventoryRouter.patch('',
    async (request: Request, response: Response) => {
        const patch: Inventory = request.body;

        const patchedInv: Inventory = await inventoryService.patch(patch);

        if (patchedInv.id) {
            response.json(patchedInv);
        } else {
            
        }

        response.sendStatus(200);
    });

inventoryRouter.delete('/:id',
    (request: Request, response: Response) => {

        response.sendStatus(200);
    });

export default inventoryRouter;
