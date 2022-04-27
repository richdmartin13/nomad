class ChestMenu extends InventoryHUD {
    constructor(config) {
        super(config);

        this.options = {
            up: {
                name: "up",
                action: () => { config.EquipAction || console.log('up!') },
                x: utils.withGrid(11.5),
                y: utils.withGrid(9.75),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            down: {
                name: "up",
                action: () => { config.EquipAction || console.log('down!') },
                x: utils.withGrid(12.5),
                y: utils.withGrid(9.75),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            i0: {
                name: "inventory0",
                action: () => { config.EquipAction || console.log('i0!') },
                x: utils.withGrid(10.5),
                y: utils.withGrid(10.5),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            i1: {
                name: "inventory1",
                action: () => { config.EquipAction || console.log('i1!') },
                x: utils.withGrid(11.5),
                y: utils.withGrid(10.5),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            i2: {
                name: "inventory2",
                action: () => { config.EquipAction || console.log('i2!') },
                x: utils.withGrid(12.5),
                y: utils.withGrid(10.5),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            i3: {
                name: "inventory3",
                action: () => { config.EquipAction || console.log('i3!') },
                x: utils.withGrid(13.5),
                y: utils.withGrid(10.5),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            i4: {
                name: "inventory4",
                action: () => { config.EquipAction || console.log('i4!') },
                x: utils.withGrid(10.5),
                y: utils.withGrid(11.5),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            i5: {
                name: "inventory5",
                action: () => { config.EquipAction || console.log('i5!') },
                x: utils.withGrid(11.5),
                y: utils.withGrid(11.5),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            i6: {
                name: "inventory6",
                action: () => { config.EquipAction || console.log('i6!') },
                x: utils.withGrid(12.5),
                y: utils.withGrid(11.5),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            i7: {
                name: "inventory7",
                action: () => { config.EquipAction || console.log('i7!') },
                x: utils.withGrid(13.5),
                y: utils.withGrid(11.5),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
        }

        this.storedItems = {

        }
        this.chestContainer = new Image();
        this.chestContainer.src = '/assets/images/ui/chest.png';
    }

    draw({ context }) {
        var hero = this.map.gameObjects['hero'];

        context.drawImage(
            this.background,
            utils.withGrid(9.5), utils.withGrid(6),
            96, 112
        )

        context.drawImage(
            this.chestContainer,
            utils.withGrid(9.5), utils.withGrid(6.2),
            96, 112
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
                    y: utils.withGrid(yCount + 0.5)
                }
                xCount++;
            }
            count = items[key].count;

            var x = items[key].pos.x + utils.withGrid(10.75);
            var y = items[key].pos.y + utils.withGrid(10.25);

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
        // Object.values(this.options).forEach(object => {
        //     var x = object.x;
        //     var y = object.y;

        //     context.drawImage(this.button, x, y);

        //     context.font = '5px "Press Start 2P"';
        //     context.fillStyle = '#FFF';
        //     context.fillText(object.name, x + 3, y + 11);
        // })

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

        if (x < this.options[key].x / 16 || x > this.options[key].x / 16 + 1 || y < this.options[key].y / 16 || y > this.options[key].y / 16 + 1) {
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