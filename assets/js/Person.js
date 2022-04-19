class Person extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;
        this.isIdle = false;

        this.isPlayer = config.isPlayer || false;
        this.offset = { x: 8, y: 18 }

        this.directionUpdate = {
            "up": ["posY", -1],
            "down": ["posY", 1],
            "left": ["posX", -1],
            "right": ["posX", 1]
        }

        this.sprite.setOffset(this.offset);

        this.inventory = {
            'material': {},
            'tool': {},
            'food': {}
        },

        this.inventoryItemCount = null;
    }

    update(state) {
        this.sprite.animationFrameLimit = 8/state.frameLimitCompensation;
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {

            //player can walk
            if (this.isPlayer && state.arrow && !state.map.isCutscenePlaying) {
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                })
            }
            this.updateSprite(state);
        }
    }

    startBehavior(state, behavior) {
        //set direction to behavior
        this.direction = behavior.direction;
        if(behavior.type == "walk") {

            // console.log(this.posX/16, this.posY/16)
            //stop if space not free
            if(state.map.isSpaceTaken(this.posX, this.posY, this.direction)) {
                behavior.retry && setTimeout(() => {
                    this.startBehavior(state, behavior)
                }, 200)
                return;
            }

            //ready to walk
            state.map.moveWall(this.posX, this.posY, this.direction);
            this.movingProgressRemaining = 16;
            this.updateSprite(state);
        };

        if(behavior.type == "idle") {
            this.isIdle = true
            setTimeout(() => {
                utils.emitEvent("PersonFinishedIdle", {
                    whoId: this.id
                })
                this.isIdle = false;
            }, behavior.time)
        }

    }

    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining -= 1;

        if(this.movingProgressRemaining === 0) {
            utils.emitEvent("PersonFinishedWalking", {
                whoId: this.id
            });
        }
    }

    updateSprite() {
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("walk-" + this.direction);
            return;
        } 
        this.sprite.setAnimation("idle-" + this.direction);
    }

    addInventoryItem({item}) {
        this.inventory[item.type][item.id] = item;
        this.inventoryItemCount = this.getInventoryItemCount();
    }

    removeInventoryItem({type, item}) {
        var match;

        Object.keys(this.inventory[type].forEach(key => {
            match = key;
        }))

        if(match) {
            delete this.inventory[type][match];
        } else {
            console.log('no match');
        }
    }

    getInventoryItemCount() {
        var items = {};
        
        Object.keys(this.inventory).forEach(type => {
            if(Object.keys(this.inventory[type]).length > 0) {
                Object.keys(this.inventory[type]).forEach(key => {
                    if(items[this.inventory[type][key].item] == null) {
                        items[this.inventory[type][key].item] = {
                            item: this.inventory[type][key].item,
                            count: 1 
                        }
                    } else {
                        items[this.inventory[type][key].item].count += 1;
                    }
                })
            }
        })
        return items;
    }

    getItemCount(item) {
        var items = this.getInventoryItemCount();

        Object.values(items).forEach(object => {
            if(object.count > 0 && object.item == item) {
                return object.count;
            } else {
                return 0;
            }
        })
    }
}