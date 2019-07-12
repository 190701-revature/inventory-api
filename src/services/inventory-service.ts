import Inventory from '../models/Inventory';
import db from '../util/pg-connector';

export function createInventory(inventory: Inventory):
    Promise<Inventory[]> {
    // enforce business rules
    if (!inventory.itemName) {
        console.warn('Inventory item requires name');
    }

    // This operation will send a query to the database,
    // which will then return a new promise that includes
    // only the row data

    return db.query(`INSERT INTO inventory (item_name, quantity)
    VALUES ($1, $2) RETURNING id, item_name, quantity`,
        [inventory.itemName, inventory.quantity])
        .then((data) => {
            return data.rows;
        }).catch((err) => {
            return [];
        });
}

export async function getInventoryById(id: number): Promise<Inventory> {
    const result = await db.query(`SELECT id, item_name "itemName", quantity
        FROM inventory WHERE id = $1`, [id]);
    return new Inventory(result.rows[0]);
}

export async function patchCoalesce(patch: Inventory) {
    const result = await db.query(`UPDATE inventory SET item_name = COALESCE($1, item_name), \
quantity = COALESCE($2, quantity) WHERE id = $3 \
RETURNING id, item_name "itemName", quantity;`,
        [patch.itemName, patch.quantity, patch.id]);

    if (result.rowCount === 0) {
        // throw error, 404
    } else {
        return result.rows[0];
    }
}


export async function patchInventory(patch: Inventory) {
    if (!patch.id) {
        // throw an error
    }

    const currentState = await getInventoryById(patch.id);
    const newState = {
        ...currentState, ...patch,
    };

    const result = await db.query(`UPDATE inventory SET item_name = $1, quantity = $2 WHERE id = $3 
    RETURNING id, item_name "itemName", quantity;`,
        [newState.itemName, newState.quantity, newState.id]);

    if (result.rowCount === 0) {
        // throw error, 404
    } else {
        return result.rows[0];
    }
}
