class World {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.context = this.canvas.getContext('2d');
        this.map = null;
        this.tileMap = null;
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
            // this.map.drawChunk(this.tileMap)

            //Draw Game Objects
            Object.values(this.map.gameObjects).sort((a, b) => {
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

        if (typeof screen.orientation === 'undefined') {
            var buttons = document.querySelector(".buttons");
            buttons.innerHTML = (`
        <div class="ab_btns">
            <div>
                <p>&nbsp;</p>
                <button class="controls" id="b"><img class="ctrl-img" src="/assets/images/ui/B.png"/></button>
            </div>
            <div>
                <button class="controls" id="a"><img class="ctrl-img" src="/assets/images/ui/A.png"/></button>
                <p>&nbsp;</p>
            </div>
        </div>
        <div class="mvmt_buttons">
            <button class="controls" id="left"><img class="ctrl-img" src="/assets/images/ui/left.png"/></button>
            <div class="updown">
                <button class="controls" id="up"><img class="ctrl-img" src="/assets/images/ui/up.png"/></button>
                <br/>
                <button class="controls" id="down"><img class="ctrl-img" src="/assets/images/ui/down.png"/></button>
            </div>
            <button class="controls" id="right"><img class="ctrl-img" src="/assets/images/ui/right.png"/></button>
        </div>
        `)

            document.querySelector("#a").addEventListener("click", () => {
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    code: 'KeyE'
                }))
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    code: 'KeyE'
                }))
                console.log('A pressed')
            });
            document.querySelector("#b").addEventListener("click", () => {
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    code: 'KeyQ'
                }))
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    code: 'KeyQ'
                }))
                console.log('B pressed')
            })

            document.querySelector("#up").addEventListener("touchstart", () => {
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    code: 'ArrowUp'
                }))
                console.log('Up pressed')
            })
            document.querySelector("#up").addEventListener("touchend", () => {
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    code: 'ArrowUp'
                }))
                console.log('Up released')
            })

            document.querySelector("#down").addEventListener("touchstart", () => {
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    code: 'ArrowDown'
                }))
                console.log('DOWN pressed')
            })
            document.querySelector("#down").addEventListener("touchend", () => {
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    code: 'ArrowDown'
                }))
                console.log('DOWN released')
            })

            document.querySelector("#left").addEventListener("touchstart", () => {
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    code: 'ArrowLeft'
                }))
                console.log('left pressed')
            })
            document.querySelector("#left").addEventListener("touchend", () => {
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    code: 'ArrowLeft'
                }))
                console.log('left released')
            })

            document.querySelector("#right").addEventListener("touchstart", () => {
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    code: 'ArrowRight'
                }))
                console.log('Right pressed')
            })
            document.querySelector("#right").addEventListener("touchend", () => {
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    code: 'ArrowRight'
                }))
                console.log('right released')
            })

        }
    }

    startMap(mapConfig) {
        this.map = new WorldMap(mapConfig);
        this.map.world = this;
        this.map.mountObjects();
    }

    init() {
        // const test = new Tile({
        //     type: 'grass'
        // });
        // test.init();

        // this.tileMap = new TileMap({
        //     context: this.context 
        // })
        // this.tileMap.init()

        this.startMap(window.WorldMaps.Office);

        this.bindHeroPositionCheck();
        this.bindActionInput();

        this.directionInput = new DirecitonInput();
        this.directionInput.init();

        this.startGameLoop();

        // this.map.startCutscene([
        //     { who: "hero", type: "walk", direction: "down"},
        //     { who: "hero", type: "walk", direction: "down"},
        //     { who: "hero", type: "idle", direction: "down", time: 400},
        // ])
    }
}