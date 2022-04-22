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

        },
        this.activeBar = {
            tool: null,
            prop: null,
            food: null,
            armor: null
        }

        this.inventoryItemCount = null;

        this.speed = 1;
    }

    update(state) {
        // this.sprite.animationFrameLimit = 8/state.frameLimitCompensation;
        // this.speed = 200 * state.frameLimitCompensation;
        // console.log(this.speed)
        // if(this.speed > 500) {
        //     this.speed = 500;
        // } else if(this.speed < 100) {
        //     this.speed = 100;
        // }
        // console.log(this.speed)
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {

            //player can walk
            if (this.isPlayer && state.arrow && !state.map.isCutscenePlaying && !(state.map.menuIsOpen && state.map.inventoryOpen) && !state.map.messageOpen) {
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
        this.inventory[item.id] = item;
        this.inventoryItemCount = this.getInventoryItemCount();
    }

    removeInventoryItem({item}) {
        var match;

        Object.keys(this.inventory).forEach(key => {
            if(!match && this.inventory[key].item == item) {
                match = key;
            }
        })

        if(match) {
            delete this.inventory[match];
        } else {
            console.log('no match');
        }
    }

    getInventoryItemCount() {
        var items = {};
        
        // Object.keys(this.inventory).forEach(type => {
        //     if(Object.keys(this.inventory[type]).length > 0) {
        //         Object.keys(this.inventory[type]).forEach(key => {
        //             if(items[this.inventory[type][key].item] == null) {
        //                 items[this.inventory[type][key].item] = {
        //                     item: this.inventory[type][key].item,
        //                     count: 1 
        //                 }
        //             } else {
        //                 items[this.inventory[type][key].item].count += 1;
        //             }
        //         })
        //     }
        // })

        Object.keys(this.inventory).forEach(key => {
            if(items[`${this.inventory[key].item}`] == null) {
                // console.log(this.inventory[key])
                items[this.inventory[key].item] = {
                    item: this.inventory[key].item,
                    src: this.inventory[key].img,
                    count: 1,
                    pos: {x: -1, y: 0}
                }
            } else {
                items[`${this.inventory[key].item}`].count += 1;
            }
        })
        return items;
    }
}