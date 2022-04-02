class World {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.context = this.canvas.getContext('2d');
        this.map = null;
    }

    startGameLoop() {
        const step = () => {

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

            //Establish Camera
            const cameraMan = this.map.gameObjects.hero;

            //Update Game Objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map
                });
            })

            //Draw Lower Layer
            this.map.drawLower(this.context, cameraMan)

            //Draw Game Objects
            Object.values(this.map.gameObjects).sort((a,b) => {
                return a.posY - b.posY
            }).forEach(object => {
                object.sprite.draw(this.context, cameraMan);
            })

            //Draw Upper Layer
            this.map.drawUpper(this.context, cameraMan)

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonFinishedWalking", e => {
            if(e.detail.whoId === "hero") {
                this.map.checkForFootstepCutscene();
            }
        })
    }

    startMap(mapConfig) {
        this.map = new WorldMap(mapConfig);
        this.map.world = this;
        this.map.mountObjects();
    }

    init() {
        this.startMap(window.WorldMaps.DemoRoom);

        this.bindHeroPositionCheck();

        this.directionInput = new DirecitonInput();
        this.directionInput.init();

        this.startGameLoop();

        this.map.startCutscene([
            { who: "hero", type: "walk", direction: "down"},
            { who: "hero", type: "walk", direction: "down"},
            { who: "hero", type: "idle", direction: "down", time: 400},
        ])
    }
}