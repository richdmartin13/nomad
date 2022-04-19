class World {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.context = this.canvas.getContext('2d');
        this.map = null;
        this.tileMap = null;
        this.mapSize = { x: 64, y: 64 }
        this.tileSize = { x: 16, y: 16 }
        this.smoothing = 60;
        this.terrain = null;
        this.mapList = {};
        this.gamePad = null;
        this.inventoryHUD = null;
        this.menu = null;
        this.menuOpen = false;
        this.inventoryOpen = false;
        this.FPS = {
            current: 0,
            frameCount: 0,
            framesLastSecond: 0,
            compensation: 1
        }
        this.debug = false;
    }

    startGameLoop() {
        const step = () => {

            this.canvas.height = this.canvas.width;
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

            //Track Framerate & Compensate animations
            this.frameRate();

            //Establish Camera
            const cameraMan = this.map.gameObjects.hero;

            //Update Game Objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map,
                    frameLimitCompensation: this.FPS.compensation
                });
            })

            //Draw Lower Layer
            this.map.drawLower(this.context, cameraMan)

            //Draw Perlin Map
            if (!this.map.custom && this.map.terrain == null) {
                this.map.drawMap(this.map, this.context, this.mapSize, this.tileSize, cameraMan);
            }

            //Draw Game Objects
            Object.values(this.map.gameObjects).sort((a, b) => {
                if (!a.collision) {
                    return -1
                }
                return a.posY - b.posY
            }).forEach(object => {
                object.sprite.draw(this.context, cameraMan);
            })

            //Draw Upper Layer
            this.map.drawUpper(this.context, cameraMan);

            //Draw GamePad
            this.gamePad.draw({ context: this.context });

            if (this.inventoryOpen) {
                //Draw Inventory HUD
                this.inventoryHUD.draw({ context: this.context, hero: this.map.gameObjects["hero"] });
            }

            if (this.menuOpen) {
                //Draw Menu
                this.menu.draw({ context: this.context });
            }

            if (this.debug) {
                //Draw FrameRate
                this.drawFrameRate();
                this.getPos();
            }

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    frameRate() {
        var sec = Math.floor(Date.now() / 1000);
        if (sec != this.FPS.currentSecond) {
            this.FPS.currentSecond = sec;
            this.FPS.framesLastSecond = this.FPS.frameCount;
            this.FPS.frameCount = 1;
            this.FPS.compensation = 60/this.FPS.framesLastSecond;
        } else {
            this.FPS.frameCount++;
        }
    }

    drawFrameRate() {
        this.context.fillStyle = '#FFF';
        this.context.font = '8px sans-serif'
        this.context.fillText(`FPS: ${this.FPS.framesLastSecond}`, utils.withGrid(9.5), utils.withGrid(6.2));
        this.context.font = '6px sans-serif'
        this.context.fillText(`x${this.FPS.compensation}`, utils.withGrid(9.5), utils.withGrid(6.6));
    }

    getPos() {
        this.context.fillStyle = '#FFF';
        this.context.font = '8px sans-serif'
        this.context.fillText(`( ${Math.floor(this.map.gameObjects['hero'].posX/16)},${Math.floor(this.map.gameObjects['hero'].posY/16)} )`, utils.withGrid(13.75), utils.withGrid(6.2));
        this.context.font = '6px sans-serif'
        this.context.fillText(`${this.map.gameObjects['hero'].direction}`, utils.withGrid(13.75), utils.withGrid(6.6));
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonFinishedWalking", e => {
            if (e.detail.whoId === "hero") {
                this.map.checkForFootstepCutscene();
            }
        })
    }

    bindActionInput() {
        //Enter Key
        new KeyPressListener('Enter', () => {
            this.map.checkForActionCutscene();
        })
        //GamePad A, Keyboard E for Interaction
        new KeyPressListener('KeyE', () => {
            this.map.checkForActionCutscene();
        })
        //GamePad B, Keyboard Q for Cancel, (run?)
        new KeyPressListener('KeyQ', () => {
            this.menuOpen = false;
        })
        //GamePad Select, Keyboard 1 for ?
        new KeyPressListener('Digit1', () => {
            this.debug = !this.debug;
        })
        //GamePad Option, Keyboard 3 for Reload || (?)
        new KeyPressListener('Digit3', () => {
                this.map.startCutscene([
                    { who: "hero", type: "idle", direction: "up", time: 10 },
                ])
                this.menuOpen = !this.menuOpen;
                if (!this.menuOpen) {
                    this.map.startCutscene([
                        { who: "hero", type: "idle", direction: "down", time: 10 },
                    ])
                    location.reload();
                }
        })
        //GamePad Home, Keyboard T for Inventory, (menu, reload?)
        new KeyPressListener('KeyR', () => {
            this.map.startCutscene([
                { who: "hero", type: "idle", direction: "up", time: 10 },
            ])
            this.inventoryOpen = !this.inventoryOpen;
            if (!this.inventoryOpen) {
                this.map.startCutscene([
                    { who: "hero", type: "idle", direction: "down", time: 10 },
                ])
            }
        })

        this.gamePad = new GamePad({ buttonSize: 16 });
        this.gamePad.bindClick(this.canvas);
    }

    startMap(mapConfig) {

        //Check if a map exists in the cache with the designated Key
        if (this.mapList[mapConfig.id] == null) {
            //If not, create it and add it to the cache
            this.map = new WorldMap(mapConfig);
            this.map.mapSize = this.mapSize;
            if (!this.map.custom && this.map.terrain == null) {
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

        this.inventoryHUD = new InventoryHUD();

        this.menu = new Menu({debug: () => this.debug = !this.debug});

        this.startGameLoop();

        // this.map.startCutscene([
        //     { who: "hero", type: "collectItem", item: "apple"},
        //     { who: "hero", type: "collectItem", item: "wood"},
        //     { who: "hero", type: "collectItem", item: "rock"},
        //     { who: "hero", type: "collectItem", item: "iron"},
        // ])
    }
}