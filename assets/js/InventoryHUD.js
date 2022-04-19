class InventoryHUD {
    constructor() {
        this.items = {
            wood: {
                item: new InventoryItem({item: 'wood'}),
                pos: { x: 0, y: 0 }
            },
            rock: {
                item: new InventoryItem({item: 'rock'}),
                pos: { x: 12, y: 0 }
            },
            iron: {
                item: new InventoryItem({item: 'iron'}),
                pos: { x: 24, y: 0 }
            },
            apple: {
                item: new InventoryItem({item: 'apple'}),
                pos: { x: 36, y: 0 }
            },
        };

        this.size = 8;
    }

    draw({ context, hero }) {
        Object.keys(this.items).forEach(key => {
            var x = this.items[key].pos.x + utils.withGrid(10);
            var y = this.items[key].pos.y + utils.withGrid(12);
            var itemCount = 0;

            context.drawImage(
                this.items[key].item.img,
                x, y,
                this.size, this.size
            )
            context.font = '8px sans-serif'
            var items = hero.getInventoryItemCount();
            
            Object.values(items).forEach(object => {
                if(object.item == key) {
                    itemCount = object.count;
                }
            })

            context.fillStyle = '#FFF'
            context.fillText(itemCount, x + 6, y + 12);
        })
    }
}