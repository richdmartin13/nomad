class GameObject {
    constructor(config) {
        //x, y, src
        this.id = null;
        this.isMounted = false;
        this.posX = config.x || 0;
        this.posY = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            useShadow: config.useShadow,
            gameObject: this,
            src: config.src || "/assets/images/error.png",
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;

        this.talking = config.talking || {};

        this.map = config.map;
        this.type = config.type || '';

        // this.getRandomSpawn()
    }

    getRandomSpawn() {
        // Maybe instead of testing elevation, determine 
        // if there's a wall where we want to spawn?
        //
        // First, generate a random set of coordinates.
        // Then, check if there's a wall at that set of coordinates.
        // If so, generate a new set. Else, consider the area safe
        // and place the object there.
        //
        // Ideally, it's gotta operate off of a flag. TerrainObjects
        // like trees aren't randomized in the same way.

        var x = Math.floor(Math.Random*this.map[0].length);
        var y = Math.floor(Math.Random*this.map.length);

        if(this.map[x,y] > 0.3) {
            this.posX = x;
            this.posY = y;
        }
    }

    update() {}

    mount(map) {
        this.isMounted = true;
        map.addWall(this.posX, this.posY)

        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10);
    }

    async doBehaviorEvent(map) {
        if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isIdle) {
            return;
        }

        //set up event with info
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        //create event instance and wait for it to execute
        const eventHandler = new WorldEvent({ map, event: eventConfig });
        await eventHandler.init();

        //set next event
        this.behaviorLoopIndex += 1;
        if(this.behaviorLoopIndex == this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }

        this.doBehaviorEvent(map);
    }
}