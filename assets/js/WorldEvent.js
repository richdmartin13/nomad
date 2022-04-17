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

    collect(resolve) {
        const item = new InventoryItem({
            who: this.event.who,
            type: this.event.type,
            item: this.event.item
        })
        const completeHandler = e => {
            if(e.detail.whoId === this.event.who) {
                document.removeEventListener("CollectItem", completeHandler);
                resolve();
            }
        }
        document.addEventListener("CollectItem", completeHandler)
        this.event.who.addInventoryItem({type: item.type, item: item});
        resolve();
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
}