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
    }

    update(state) {
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
}