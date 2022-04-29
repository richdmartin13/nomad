class InventoryHUD extends Menu {
    constructor(config) {
        super(config);

        this.options = config.options || {
            equip: {
                name: "Equip",
                action: () => { config.EquipAction || config.map.gameObjects['hero'].equipItem({inventory: this.items}) },
                x: utils.withGrid(10.5),
                y: utils.withGrid(11.5),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            drop: {
                name: "Drop",
                action: () => { config.dropAction || config.map.gameObjects['hero'].dropItem() },
                x: utils.withGrid(12.5),
                y: utils.withGrid(11.5),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
        };

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
        this.slot = new Image();
        this.items = {};
        this.equipped = {};
        this.items = {};
    }

    draw({ context }) {
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

        this.readyItems = this.configItems();
        this.items = this.readyItems.i;
        this.equipped = this.readyItems.e;

        var index = 0;
        var x, y = 0;
        Object.keys(this.equipped).forEach(key => {
            context.drawImage(
                this.equipped[key].img,
                utils.withGrid(10.75 + index), utils.withGrid(8.25),
                9, 9
            )
            x = utils.withGrid(10.75 + index), y = utils.withGrid(8.25);
            index++;
        })

        var count = 0;
        Object.keys(this.items).forEach(key => {
            count = this.items[key].count;

            var x = this.items[key].pos.x + utils.withGrid(10.75);
            var y = this.items[key].pos.y + utils.withGrid(10.25);

            context.drawImage(
                this.items[key].src,
                x, y,
                9, 9
            )

            if(this.items[key].isSelected) {
                console.log(key)
                context.fillStyle = "rgba(0,0,0,0.2)";
                context.fillRect(x - 4, y - 4, 16, 16)
            }

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
        this.rect = rect;
    }

    configItems() {
        var hero = this.map.gameObjects['hero'];
        var items = hero.getInventoryItemCount();
        var equipped = hero.getEquippedItems();

        var index = 0;
        Object.keys(equipped).forEach(key => {
            var x = utils.withGrid(10.75 + index);
            var y = utils.withGrid(8.25);
            equipped[key].containsPoint = (x, y, key) => this.containsInventoryPoint(x, y, key)
            equipped[key].action = () => {
                console.log(`${x},${y},${key}`)
                this.select(key);
            }
            equipped[key].x = x;
            equipped[key].y = y;
            if(this.equipped[key] !== undefined) {
                equipped[key].isSelected = this.equipped[key].isSelected;
            } else {
                equipped[key].isSelected = false
            }
            index++;
        })

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
            var y = items[key].pos.y + utils.withGrid(10.25);
            items[key].x = x;
            items[key].y = y;
            if(this.items[key] !== undefined) {
                items[key].isSelected = this.items[key].isSelected;
            } else {
                items[key].isSelected = false
            }
            items[key].containsPoint = (x, y, key) => this.containsInventoryPoint(x, y, key)
            items[key].action = () => {
                console.log(`${x},${y},${key}`)
                this.select(key);
            }
        })

        return { i: items, e: equipped }
    }

    bindClick(isOpen) {
        this.isOpen = isOpen;

        this.items = this.configItems();
        var buttonHandler = this.buttonHandler;
        var invButtonHandler = this.invButtonHandler;
        var options = this.options;
        var invOptions = this.items;
        var isOpen = this.isOpen;
        var itemCount = this.itemCount;
        var rect = this.rect;
        this.handler = function (e) {
            buttonHandler(e, rect, options, isOpen, itemCount);
        }
        this.invHandler = function (e) {
            invButtonHandler(e, rect, invOptions, isOpen, itemCount);
        }

        if (this.isOpen) {
            document.querySelector(".game-canvas").addEventListener("pointerup", this.handler);
            document.querySelector(".game-canvas").addEventListener("pointerup", this.invHandler);
        } else {
            document.querySelector(".game-canvas").removeEventListener("pointerup", this.handler);
            document.querySelector(".game-canvas").removeEventListener("pointerup", this.invHandler);
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

    invButtonHandler(e, rect, invOptions, itemCount) {
        const x = ((e.clientX - rect.left) / 16) / utils.getScalingFactor()
        const y = ((e.clientY - rect.top) / 16) / utils.getScalingFactor()

        var equipped = invOptions['e'];
        var inventory = invOptions['i'];

        Object.keys(equipped).forEach(key => {
            if (equipped[key].containsPoint(x, y, key)) {
                equipped[key].action();
            }
        });

        Object.keys(inventory).forEach(key => {
            if (inventory[key].containsPoint(x, y, key)) {
                inventory[key].action();
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

    containsInventoryPoint(x, y, key) {
        var active = null;

        if (this.equipped[key] !== undefined) {
            if (x < this.equipped[key].x / 16 || x > this.equipped[key].x / 16 + 1 || y < this.equipped[key].y / 16 || y > this.equipped[key].y / 16 + 1) {
                active = null;
            } else {
                active = key;
            }
        }

        if (this.items[key] !== undefined) {
            if (x < this.items[key].x / 16 || x > this.items[key].x / 16 + 1 || y < this.items[key].y / 16 || y > this.items[key].y / 16 + 1) {
                active = null;
            } else {
                active = key;
            }
        }

        return active === key;
    }

    select(key) {
        if (this.equipped[key] !== undefined) {
            Object.keys(this.equipped).forEach(kie => {
                if (key === kie && this.equipped[key].isSelected !== undefined && !this.equipped[key].isSelected) {
                    this.equipped[key].isSelected = true
                    console.log(key)
                } else {
                    this.equipped[kie].isSelected = false
                }
            })
        } else {
            Object.keys(this.equipped).forEach(kie => {
                this.equipped[kie].isSelected = false;
            })
        }

        if (this.items[key] !== undefined) {
            Object.keys(this.items).forEach(kie => {
                if (key === kie && this.items[key].isSelected !== undefined && !this.items[key].isSelected) {
                    this.items[kie].isSelected = true
                } else {
                    this.items[kie].isSelected = false
                }
            })
        } else {
            Object.keys(this.items).forEach(kie => {
                this.items[kie].isSelected = false;
            })
        }
    }
}