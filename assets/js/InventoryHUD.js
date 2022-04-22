class InventoryHUD extends Menu {
    constructor(config) {
        super(config);

        this.options = config.options || {
            equip: {
                name: "Equip",
                action: () => { config.EquipAction || console.log('equip!') },
                x: utils.withGrid(10.5),
                y: utils.withGrid(11.5),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            drop: {
                name: "Drop",
                action: () => { config.dropAction || console.log('drop!') },
                x: utils.withGrid(12.5),
                y: utils.withGrid(11.5),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
        };
        this.equippedItems = {
            placeable: null,
            tool: null,
            food: null,
            armor: null
        }
        this.map = config.map;
        this.inventoryContainer = new Image();
        this.inventoryContainer.src = '/assets/images/ui/inventory.png';
        this.sprite = new Image();
        this.sprite.src = '/assets/images/error.png';
        this.spriteLoaded = false;
        this.sprite.onload = () => {
            this.spriteLoaded = true;
        }
        this.button = new Image();
        this.button.src = '/assets/images/ui/buttonSmall.png'
    }

    draw({ context }) {
        var hero = this.map.gameObjects['hero'];

        context.drawImage(
            this.background,
            utils.withGrid(9.5), utils.withGrid(6),
            96, 112
        )

        context.drawImage(
            this.inventoryContainer,
            utils.withGrid(9.5), utils.withGrid(6),
            96, 96
        )

        context.fillStyle = '#212121';
        context.font = '6px "Press Start 2P"'
        context.fillText(this.title, utils.withGrid(10.45), utils.withGrid(6.85))

        var itemCount = hero.getInventoryItemCount();
        var items = itemCount;

        var xCount = 0, yCount = 0, count = 0;
        Object.keys(items).forEach(key => {
            if (items[key].pos.x === -1) {
                if (xCount > 3) {
                    xCount = 0;
                    yCount++;
                }
                items[key].pos = {
                    x: utils.withGrid(xCount),
                    y: utils.withGrid(yCount - 1)
                }
                xCount++;
            }
            count = items[key].count;

            var x = items[key].pos.x + utils.withGrid(10.75);
            var y = items[key].pos.y + utils.withGrid(9.25);

            context.drawImage(
                items[key].src,
                x, y,
                9, 9
            )

            context.font = '6px "Press Start 2P"'
            context.fillStyle = '#FFF'
            context.fillText(count, x + 6, y + 12);

        })

        // Draw Options
        Object.values(this.options).forEach(object => {
            var x = object.x;
            var y = object.y;

            context.drawImage(this.button, x, y);

            context.font = '5px "Press Start 2P"';
            context.fillStyle = '#FFF';
            context.fillText(object.name, x + 3, y + 11);
        })

    }

    init(rect) {
        var buttonHandler = this.buttonHandler;
        var options = this.options;
        var isOpen = this.isOpen;
        var itemCount = this.itemCount;
        this.handler = function (e) {
            buttonHandler(e, rect, options, isOpen, itemCount);
        }
    }

    bindClick(isOpen) {
        this.isOpen = isOpen;

        if (this.isOpen) {
            document.querySelector(".game-canvas").addEventListener("pointerup", this.handler);
        } else {
            document.querySelector(".game-canvas").removeEventListener("pointerup", this.handler);
        }
    }

    buttonHandler(e, rect, options, itemCount) {
        const x = ((e.clientX - rect.left) / 16) / utils.getScalingFactor()
        const y = ((e.clientY - rect.top) / 16) / utils.getScalingFactor()

        Object.keys(options).forEach(key => {
            if (options[key].containsPoint(x, y, key)) {
                options[key].action();
            }
        });

        // Object.keys(itemCount).forEach(key => {
        //     if (itemCount[key].select(x, y, key)) {
        //         itemCount[key].action();
        //     };
        // })
    }

    containsPoint(x, y, key) {
        var active = null;

        if (x < this.options[key].x / 16 - 0.1 || x > this.options[key].x / 16 + 2.6 || y < this.options[key].y / 16 - 0.1 || y > this.options[key].y / 16 + 1) {
            active = null;
        } else {
            active = key;
        }
        return active === key;
    }

    select(x, y, key) {
        var active = null;

        if (x < this.options[key].x / 16 - 0.1 || x > this.options[key].x / 16 + 2.6 || y < this.options[key].y / 16 - 0.1 || y > this.options[key].y / 16 + 1) {
            active = null;
        } else {
            active = key;
        }

        return active === key;
    }
}