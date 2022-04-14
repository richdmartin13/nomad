class GameObject {
    constructor(config) {
        //x, y, src
        this.id = null;
        this.isMounted = false;
        this.posX = config.x || 0;
        this.posY = config.y || 0;
        //complete refactor but this.position.x is a lot nicer than what we have here.
        //I could more easily make a random spawn on land function if it could check a random
        //x and y coord and throw it in there, but now that I'm thinking, it could definitely
        //be avoided if, in its constructor, it called a function to check map locations and set the
        //x and y coordinates from there.
        //
        //While we're at it here, go ahead and make classes for things like trees, rocks, etc. 
        //You can implement random textures and add functionality more easily than if you slumped it 
        //together here in the spirit of making it work.
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            useShadow: config.useShadow,
            gameObject: this,
            src: config.src || "/assets/images/characters/people/rich.png",
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;

        this.talking = config.talking || {};
    }

    update() {}

    mount(map) {
        this.isMounted = true;
        map.addWall(this.posX, this.posY)
        console.log(this.posX, this.posY)

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