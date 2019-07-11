export default class Inventory {
    public id: number;
    public itemName: string;
    public quantity: number;

    constructor(obj) {
        if (!obj) {
            return;
        }

        this.id = obj.id;
        this.itemName = obj.itemName;
        this.quantity = obj.quantity;
    }
}
