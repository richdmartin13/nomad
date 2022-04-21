class InventoryHUD {
    constructor({ map }) {
        this.items = {
            log: {
                item: new InventoryItem({ item: 'log' }),
                pos: { x: 0, y: 0 }
            },
            rock: {
                item: new InventoryItem({ item: 'rock' }),
                pos: { x: 12, y: 0 }
            },
            iron: {
                item: new InventoryItem({ item: 'iron' }),
                pos: { x: 24, y: 0 }
            },
            apple: {
                item: new InventoryItem({ item: 'apple' }),
                pos: { x: 36, y: 0 }
            },
        };

        this.background = new Image();
        this.background.src = '/assets/images/ui/inventory.png';

        this.hasPos = false;
        this.size = 10;
    }

    draw({ context, hero }) {
        this.setPos();

        context.drawImage(
            this.background,
            utils.withGrid(9.5), utils.withGrid(6),
            96, 112
        )

        context.fillStyle = '#212121';
        context.font = '6px "Press Start 2P"'
        context.fillText("Inventory", utils.withGrid(10.45), utils.withGrid(7.75))

        var itemCount = hero.getInventoryItemCount();
        // var items = Object.keys(itemCount).length > 0 ? itemCount : this.items;
        var items = itemCount;

        var xCount = 0, yCount = 0;
        Object.keys(items).forEach(key => {
            if (items[key].pos.x === -1) {
                if (xCount > 3) {
                    xCount = 0;
                    yCount++;
                }
                items[key].pos = {
                    x: utils.withGrid(xCount),
                    y: utils.withGrid(yCount)
                }
                xCount++;
            }

            var x = items[key].pos.x + utils.withGrid(10.75);
            var y = items[key].pos.y + utils.withGrid(9.25);
            var itemCount = 0;

            if (items[key] !== null) {
                context.drawImage(
                    items[key].src,
                    x, y,
                    this.size, this.size
                )
                context.font = '6px "Press Start 2P"'

                Object.values(items).forEach(object => {
                    if (object.item == key) {
                        itemCount = object.count;
                    }
                })

                context.fillStyle = '#FFF'
                context.fillText(itemCount, x + 6, y + 12);

            }
        })
    }

    setPos() {
        if (this.items.isDefault) {
            return;
        } else {
            var xCount = 0, yCount = 0;

            Object.keys(this.items).forEach(key => {
                this.items[key].pos = {
                    x: utils.withGrid(xCount),
                    y: utils.withGrid(yCount)
                }
                if (yCount > 3) {
                    yCount = 0;
                } else {
                    yCount++;
                }
                this.items[key].pos.y = utils.withGrid(yCount);
            })
        }
    }
}