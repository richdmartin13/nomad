class World {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.context = this.canvas.getContext('2d');
        this.map = null;
        this.tileMap = null;
        this.mapSize = { x: 32, y: 32 }
        this.tileSize = { x: 16, y: 16 }
        this.smoothing = 60;
        this.terrain = null;
        this.mapList = {};
        this.gamePad = null;
    }

    startGameLoop() {
        const step = () => {

            this.canvas.height = this.canvas.width;
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

            //Draw Perlin Map
            if(!this.map.custom && this.map.terrain == null) {
                this.map.drawMap(this.map, this.context, this.mapSize, this.tileSize, cameraMan);
            }

            //Draw Game Objects
            Object.values(this.map.gameObjects).sort((a, b) => {
                if(!a.collision ) {
                    return -1
                }
                return a.posY - b.posY
            }).forEach(object => {
                object.sprite.draw(this.context, cameraMan);
            })

            //Draw Upper Layer
            this.map.drawUpper(this.context, cameraMan);

            //Draw GamePad
            // if(typeof screen.orientation === 'undefined') {
                this.gamePad.draw({context: this.context});
            // }

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonFinishedWalking", e => {
            if (e.detail.whoId === "hero") {
                this.map.checkForFootstepCutscene();
            }
        })
    }

    bindActionInput() {
        new KeyPressListener('Enter', () => {
            //is there someone to talk to?
            this.map.checkForActionCutscene();
        })
        new KeyPressListener('KeyE', () => {
            //is there someone to talk to?
            this.map.checkForActionCutscene();
        })

        this.gamePad = new GamePad({ buttonSize: 16 });
        this.gamePad.bindClick(this.canvas);
    }

    startMap(mapConfig) {

        //Check if a map exists in the cache with the designated Key
        if(this.mapList[mapConfig.id] == null) {
            //If not, create it and add it to the cache
            this.map = new WorldMap(mapConfig);
            if(!this.map.custom && this.map.terrain == null){
                this.map.drawWorldBorder(this.mapSize);
                this.map.terrain = this.map.buildMap(this.mapSize, this.smoothing)
                this.map.addTerrainObjects(this.mapSize);
            }
            this.mapList[mapConfig.id] = this.map;
        } else {
            //Else, pull it from the cache instead of generating a new one
            this.map = this.mapList[mapConfig.id];
        }

        this.map.world = this;
        this.map.mountObjects();
    }

    init() {

        // var heightRatio = 1.5;
        // this.canvas.height = this.canvas.width * heightRatio;
        
        this.startMap(window.WorldMaps.Procedural);

        this.bindHeroPositionCheck();
        this.bindActionInput();

        this.directionInput = new DirecitonInput();
        this.directionInput.init();

        this.startGameLoop();

        // this.map.startCutscene([
        //     { who: "Rich", type: "message", text: "If you find yourself in water, just refresh the page!"},
        // ])
    }
}