class WorldEvent {
    constructor({map, event}) {
        this.map = map,
        this.event = event;
    }

    idle(resolve) {
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({
            map: this.map
        }, {
            type: "idle",
            direction: this.event.direction,
            time: this.event.time
        })

        const completeHandler = e => {
            if(e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonFinishedIdle", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonFinishedIdle", completeHandler)
    }

    walk(resolve) {
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true
        })

        const completeHandler = e => {
            if(e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonFinishedWalking", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonFinishedWalking", completeHandler)
    }

    run(resolve) {
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({
            map: this.map
        }, {
            type: "run",
            direction: this.event.direction,
            retry: true
        })

        const completeHandler = e => {
            if(e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonFinishedRunning", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonFinishedRunning", completeHandler)
    }

    message(resolve) {
        const message = new Message({
            who: this.event.who,
            text: this.event.text,
            onComplete: () => resolve()
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
            if(e.detail.whoId === this.event.who) {
                document.removeEventListener("collectItem", completeHandler);
                resolve();
            }
        }
        document.addEventListener("collectItem", completeHandler)
        for(var x = 0; x < this.event.count; x++ ) {
            item.id = `${item.id}${x}`;
            this.map.gameObjects[this.event.who].addInventoryItem({item: item});
        }
        setTimeout(() => {
            this.map.removeGameObject(this.event.pos.x, this.event.pos.y);
            this.map.startCutscene([
                { type: "message", text: `You found ${this.event.count} ${this.event.item}${this.event.count > 1 ? 's!' : '!'}`}
            ])
        }, 200)
        resolve();
    }

    placeItem(resolve) {
        this.map.addTerrainObject({
            type: this.event.type,
            pos: this.event.pos
        })
        // this.map.gameObjects[this.event.who].inventory
        resolve();
    }

    openMenu() {        
        this.map.menu.bindClick(true);
    }

    closeMenu(resolve) {
        this.map.menu.bindClick(false);
        resolve();
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
}