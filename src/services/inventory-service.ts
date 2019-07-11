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

export async function patch(patch: Inventory) {
    if (!patch.id) {
        // throw an error
    }
    const columns = [];
    const params = [];

    if (patch.itemName) {
        columns.push('item_name');
        params.push(patch.itemName);
    }

    if (!(patch.quantity === undefined)) {
        columns.push('quantity');
        params.push(patch.quantity);
    }

    let patchString = [];

    // 
    for (let i = 0; i < columns.length; i++) {
        patchString.push(`${columns[i]} = $${i+1}`)
    }

    // UPDATE inventory SET item_name = $1 WHERE id = $2;
    // UPDATE inventory set item_name = $1, quantity = $2 WHERE id = $3;

//     console.log(`UPDATE inventory SET ${patchString.join(', ')} \
// WHERE id = $${columns.length + 1} RETURNING *;`);

//     console.log([...params, patch.id]);
//     const result = await db.query(`UPDATE inventory ${patchString.join(', ')} \
// WHERE id = $${columns.length + 1} returning *;`, [...params, patch.id]);
    let counter = 1;
    const result = await db.query(`UPDATE inventory SET\
item_name = ${patch.itemName ? 'item_name' : `$${counter++}`},
quantity = ${patch.quantity === undefined ? 'quantity' : `$${counter++}` } \
WHERE id = $${patch.id}`, [...params, patch.id]);

    // const result = await db.query(`UPDATE inventory SET quantity = $1
    // WHERE id = $2 RETURNING *;`, [20, 3]);

    if (result.rowCount === 0) {
        // throw error, 404
    } else {
        return result.rows[0];
    }
}