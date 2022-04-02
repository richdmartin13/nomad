class GameObject {
    constructor(config) {
        this.id = null;
        this.isMounted = false;
        this.posX = config.x || 0;
        this.posY = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            useShadow: config.useShadow,
            gameObject: this,
            src: config.src || "/assets/images/characters/people/rich.png",
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;
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