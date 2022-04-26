class World {
    constructor(config) {
        //Canvas
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.context = this.canvas.getContext('2d');

        //Local map settings
        this.map = null;
        this.mapSize = { x: 64, y: 64 }
        this.tileSize = { x: 16, y: 16 }
        this.smoothing = 60;
        this.terrain = null;

        //Global map settings
        this.mapList = {};

        //HUD Controllers
        this.gamePad = null;
        this.menu = null;
        this.inventoryHUD = null;
        this.menuOpen = false;
        this.inventoryOpen = false;
        this.showGamePad = true;

        //Debug settings
        this.FPS = {
            current: 0,
            frameCount: 0,
            framesLastSecond: 0,
            compensation: 1,
            timeout: 0,
            tickCount: 0,
            ticksLastSecond: 0
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
            if (this.showGamePad) {
                this.gamePad.draw({ context: this.context });
            }


            if (this.debug) {
                //Draw FrameRate
                this.drawFrameRate();
                this.getPos();
            }

            if (this.map.inventoryHUD.isOpen) {
                //Draw Inventory HUD
                this.inventoryHUD.draw({ context: this.context, hero: this.map.gameObjects["hero"] });
            }

            if (this.menu.isOpen) {
                //Draw Menu
                this.menu.draw({ context: this.context });
            }

            if(this.map.gameObjects['hero'].movingProgressRemaining == 0) {
                if(!(this.menu.isOpen || this.map.inventoryHUD.isOpen))
                    this.map.checkEventQueue();
            }

            // setTimeout(() => {
                requestAnimationFrame(() => {
                    step();
                })
            // }, this.FPS.timeout)
        }
        step();
    }

    toggleDebug() {
        this.debug = !this.debug;
    }

    toggleGamePad() {
        this.showGamePad = !this.showGamePad;
    }

    frameRate() {
        var sec = Math.floor(Date.now() / 1000);
        if (sec != this.FPS.currentSecond) {
            this.FPS.currentSecond = sec;
            this.FPS.framesLastSecond = this.FPS.frameCount;
            this.FPS.ticksLastSecond = this.FPS.tickCount;
            this.FPS.frameCount = 1;
            this.FPS.tickCount = 1;
            this.FPS.compensation = 60 / this.FPS.framesLastSecond;
        } else {
            this.FPS.tickCount += 60 / this.FPS.timeout;
            this.FPS.frameCount++;
        }
        this.FPS.timeout = 10/this.FPS.compensation;
    }

    drawFrameRate() {
        this.context.fillStyle = '#FFF';
        this.context.font = '6px "Press Start 2P"'
        this.context.fillText(`FPS: ${this.FPS.framesLastSecond}`, utils.withGrid(9.25), utils.withGrid(6));
        this.context.font = '5px "Press Start 2P"'
        this.context.fillText(`TPS: ${Math.floor(this.FPS.ticksLastSecond)}`, utils.withGrid(9.25), utils.withGrid(6.4));
        // this.context.font = '5px "Press Start 2P"'
        // this.context.fillText(`tick: ${Math.floor(this.FPS.timeout)}MS`, utils.withGrid(9.25), utils.withGrid(6.4));
        this.context.font = '5px "Press Start 2P"'
        this.context.fillText(`x${Math.round(this.FPS.compensation * 100)/100}`, utils.withGrid(9.25), utils.withGrid(6.8));
    }

    getPos() {
        this.context.fillStyle = '#FFF';
        this.context.font = '6px "Press Start 2P"'
        this.context.fillText(`(${Math.floor(this.map.gameObjects['hero'].posX / 16)},${Math.floor(this.map.gameObjects['hero'].posY / 16)})`, utils.withGrid(13.25), utils.withGrid(6));
        this.context.font = '5px "Press Start 2P"'
        this.context.fillText(`${this.map.gameObjects['hero'].direction}`, utils.withGrid(13.25), utils.withGrid(6.4));
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonFinishedWalking", e => {
            if (e.detail.whoId === "hero") {
                this.map.checkForFootstepCutscene();
                this.map.checkEventQueue();
            }
        })
    }

    closeMenu() {
        this.map.startCutscene([
            { type: 'closeMenu', menu: this.map.menu },
        ])
        this.map.addToEventQueue({ who: "hero", type: "idle", direction: "down", time: 10 })
    }

    bindActionInput() {
        //Enter Key
        new KeyPressListener('Enter', () => {
            if(this.map.isCutscenePlaying == false ) {
                this.map.checkForActionCutscene();
            }
        })

        //GamePad A, Keyboard E for Interaction
        new KeyPressListener('KeyE', () => {
            if(this.map.isCutscenePlaying == false && !this.map.placeFailed) {
                this.map.checkForActionCutscene();
            }
            // } else if(this.map.isCutscenePlaying == false && this.map.placeFailed) {
            //     this.map.placeFailed = false;
            // }
        })

        //GamePad B, Keyboard Q for Cancel, (run?)
        new KeyPressListener('KeyQ', () => {

            this.map.addToEventQueue({
                type: 'placeItem', item: 'rock'
            })
        })

        //GamePad Select, Keyboard 1 for ?
        new KeyPressListener('Digit1', () => {
            console.log('select!')
        })
        //GamePad Option, Keyboard 3 for Start Menu
        new KeyPressListener('Digit3', () => {
            if (!this.menu.isOpen) {
                this.map.addToEventQueue({ who: "hero", type: "idle", direction: "up", time: 10 })
                this.map.startCutscene([
                    { type: "openMenu", menu: this.menu }
                ])
            } else {
                this.map.addToEventQueue({ who: "hero", type: "idle", direction: "down", time: 10 })
                this.map.startCutscene([
                    { type: "closeMenu", menu: this.menu }
                ])
            }
        })
        //GamePad Home, Keyboard T for Inventory
        new KeyPressListener('KeyR', () => {
            if (!this.map.inventoryHUD.isOpen) {
                this.map.addToEventQueue({ who: "hero", type: "idle", direction: "up", time: 10 })
                this.map.startCutscene([
                    { type: 'openInventory' }
                ])
            } else {
                this.map.addToEventQueue({ who: "hero", type: "idle", direction: "down", time: 10 })
                this.map.startCutscene([
                    { type: 'closeInventory' }
                ])
            }
        })

        this.gamePad = new GamePad({ buttonSize: 16 });
        this.gamePad.bindClick(this.canvas);

        this.directionInput = new DirecitonInput();
        this.directionInput.init();
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

    bindMenus() {

        //Bind Main Menu
        this.menu = new Menu({
            debug: () => this.toggleDebug(),
            isOpen: this.menuOpen,
            closeMenu: () => this.closeMenu(),
            gamepad: () => this.toggleGamePad(),
        });
        this.menu.init(this.canvas.getBoundingClientRect());
        this.map.menu = this.menu;

        //Bind Inventory Menu
        this.inventoryHUD = new InventoryHUD({
            title: 'Inventory',
            map: this.map
        });
        this.inventoryHUD.init(this.canvas.getBoundingClientRect());
        this.map.inventoryHUD = this.inventoryHUD;
    }

    init() {

        // var heightRatio = 1.5;
        // this.canvas.height = this.canvas.width * heightRatio;

        this.startMap(window.WorldMaps.Procedural);

        this.bindHeroPositionCheck();
        this.bindActionInput();
        this.bindMenus();

        this.startGameLoop();

        // this.map.startCutscene([
        //     { who: "hero", type: "collectItem", item: "apple"},
        //     { who: "hero", type: "collectItem", item: "wood"},
        //     { who: "hero", type: "collectItem", item: "rock"},
        //     { who: "hero", type: "collectItem", item: "iron"},
        // ])
    }
}