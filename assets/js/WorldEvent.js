class WorldEvent {
    constructor({ map, event }) {
        this.map = map,
            this.event = event;
    }

    idle(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: "idle",
            direction: this.event.direction,
            time: this.event.time
        })

        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonFinishedIdle", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonFinishedIdle", completeHandler)
    }

    walk(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true
        })

        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonFinishedWalking", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonFinishedWalking", completeHandler)
    }

    run(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: "run",
            direction: this.event.direction,
            retry: true
        })

        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonFinishedRunning", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonFinishedRunning", completeHandler)
    }

    timeout(resolve) {
        var timeout = this.event.time || 100;

        setTimeout(() => {
            resolve();
        }, timeout);
    }

    message(resolve) {
        this.map.messageOpen = true;
        const message = new Message({
            who: this.event.who,
            text: this.event.text,
            onComplete: () => {
                this.map.messageOpen = false;
                this.map.placeFailed = false;
                resolve()
            }
        })
        message.init(document.querySelector(".game-container"))
    }

    changeMap(resolve) {
        const sceneTransition = new SceneTransition();
        sceneTransition.init(document.querySelector(".game-container"), () => {
            this.map.world.startMap(window.WorldMaps[this.event.map]);
            resolve();
            sceneTransition.fadeOut();
        });
    }

    collectItem(resolve) {
        const item = new InventoryItem({
            who: this.map.gameObjects[this.event.who],
            item: this.event.item
        })
        item.init();

        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("collectItem", completeHandler);
                resolve();
            }
        }

        document.addEventListener("collectItem", completeHandler)
        for (var x = 0; x < this.event.count; x++) {
            item.id = `${item.id}${x}`;
            this.map.gameObjects[this.event.who].addInventoryItem({ item: item });
        }

        this.map.startCutscene([
            { type: "message", text: `You found ${this.event.count} ${this.event.item}${this.event.count > 1 ? 's!' : '!'}` }
        ])

        this.map.removeGameObject(this.event.pos.x, this.event.pos.y);

        resolve();
    }

    placeItem(resolve) {
        var hero = this.map.gameObjects['hero'];

        var itemCount = hero.getInventoryItemCount();
        var item = null;

        var pos = {
            x: this.map.gameObjects['hero'].posX,
            y: this.map.gameObjects['hero'].posY
        }
        var dir = this.map.gameObjects['hero'].direction;
        var nextPos = utils.nextPosition(pos.x, pos.y, dir);
        pos.x = nextPos.x;
        pos.y = nextPos.y;

        Object.keys(itemCount).forEach(key => {
            if (key == this.event.item) {
                item = itemCount[key];
            }
        })

        if (item !== null) {
            if (this.map.addTerrainObject({
                type: this.event.item,
                pos: pos,
                item: item
            })) {
                hero.removeInventoryItem({ item: item.item });
                this.map.placeFailed = false;
            }
            resolve();
        } else {
            this.map.placeFailed = true;
            this.map.startCutscene([
                { type: "message", text: `You're out of ${this.event.item}s!` }
            ])
        }
    }

    openMenu() {
        this.map.menuIsOpen = true;
        this.map.menu.bindClick(true);
    }

    closeMenu(resolve) {
        this.map.menuIsOpen = false;
        this.map.menu.bindClick(false);
        resolve();
    }

    openInventory() {
        this.map.inventoryHUD.bindClick(true);
    }

    closeInventory(resolve) {
        this.map.inventoryHUD.bindClick(false);
        resolve();
    }

    openChest() {
        this.map.chestMenu.bindClick(true);
    }

    closeChest() {
        this.map.chestMenu.bindClick(false);
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
}