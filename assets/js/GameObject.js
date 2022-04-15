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

        // this.getRandomSpawn(config.map)
    }

    getSRC(cfg) {
        console.log(cfg.src, this.type)
        if(cfg.src == null) {
            switch(this.type) {
                case 'rock': 
                    return '/assets/images/world/rocks.png';
                case 'bush':
                    return '/assets/images/world/bush.png';
                case 'cactus':
                    return '/assets/images/world/cactus.png';
                default: 
                    return '/assets/images/error.png';
            }
        } else return cfg.src;
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