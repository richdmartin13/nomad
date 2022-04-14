class WorldMap {
    constructor(config) {
        this.world = null;
        this.gameObjects = config.gameObjects;
        this.walls = config.walls|| {};
        this.cutsceneSpaces = config.cutsceneSpaces || {};

        this.lower = new Image();
        this.lower.src = config.lowerSrc;

        this.upper = new Image();
        this.upper.src = config.upperSrc;

        this.isCutscenePlaying = false;

        this.map = null;
        this.tileset = null;
        this.tilesetURL = '../assets/images/terrain.png';
        this.tilesetLoaded = false;

        this.colors = {
            sand: '#C2B280',
            grass: '#4f8d2f',
            dirt: '#9B7653',
            water: '#2389DA'
        }
    }

    drawLower(context, cameraMan) {
        context.drawImage(this.lower,
             utils.withGrid(10.5) - cameraMan.posX, 
             utils.withGrid(8) - cameraMan.posY
             );
    }

    drawUpper(context, cameraMan) {
        context.drawImage(this.upper,              
            utils.withGrid(10.5) - cameraMan.posX, 
            utils.withGrid(8) - cameraMan.posY
        )
    }

    //
    //
    // Test Map Build Code
    //
    buildMap(mapSize, smoothing) {
        this.map = [...Array(mapSize.x)].map(e => Array(mapSize.y));
        noise.seed(Math.random());
    
        for (var x = 0; x < mapSize.x; x++) {
            for (var y = 0; y < mapSize.y; y++) {
                var value = noise.simplex2(x / smoothing, y / smoothing);
    
                this.map[x][y] = Math.abs(value) * 1;
            }
        }
    }

    drawMap(map, ctx, mapSize, tileSize, cameraMan) {
        if (ctx === null) { return; }

        this.tileset = new Image();

        var sprites = {
            0 : {sprite: {x: 0, y: 0, w: 16, h: 16}},
            1 : {sprite: {x: 16, y: 0, w: 16, h: 16}},
            2 : {sprite: {x: 32, y: 0, w: 16, h: 16}},
            3 : {sprite: {x: 48, y: 0, w: 16, h: 16}}
        }
        var sprite = null;

        this.tileset.onload = () => {
            this.tilesetLoaded = true;
        }
        this.tileset.src = this.tilesetURL;
    
        for (var y = 0; y < mapSize.y; y++) {
            for (var x = 0; x < mapSize.x; x++) {
                var value = this.map[x][y];
    
                switch (true) {
                    case value > 0.3 && value < 0.4:
                        // sprite = sprites[1].sprite;
                        ctx.fillStyle = this.colors.sand;
                        break;
                    case value > 0.4 && value < 0.9:
                        // sprite = sprites[2].sprite;
                        ctx.fillStyle = this.colors.grass;
                        break;
                    case value > 0.9:
                        // sprite = sprites[3].sprite;
                        ctx.fillStyle = this.colors.dirt;
                        break;
                    case value < 0.3:
                    default:
                        // sprite = sprites[0].sprite;
                        ctx.fillStyle = this.colors.water;
                        this.addWall(utils.withGrid(x), utils.withGrid(y))
                        break;
                }
    
                // ctx.drawImage(
                //     this.tileset,
                //         sprite.x, sprite.y, 
                //         sprite.w, sprite.h,
                //         x*sprite.w, y*sprite.h,
                //         tileSize.x, tileSize.h
                // )
                // console.log(`image ${this.tileset.src} drawn at ${(sprite.x*x)/16}, ${(sprite.y*y)/16}`)

                ctx.fillRect( 
                    utils.withGrid(10.5) + utils.withGrid(x) - cameraMan.posX, 
                    utils.withGrid(8) + utils.withGrid(y) - cameraMan.posY, 
                    tileSize.x, 
                    tileSize.y );
            }
        }
        // console.log(this.walls)
    }

    getMap() {
        return this.map;
    }
    //
    // End Test Map Code
    //
    //

    isSpaceTaken(curX, curY, dir) {
        const {x,y} = utils.nextPosition(curX, curY, dir);
        return this.walls[`${x},${y}`] || false
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {
            let object = this.gameObjects[key];
            object.id = key;
            object.mount(this);
        })
    }

    //Cutscene Code
    async startCutscene(events) {
        this.isCutscenePlaying = true;

        for( let i=0; i<events.length; i++) {
            const eventHandler = new WorldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;

        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }

    checkForActionCutscene() {
        const hero = this.gameObjects["hero"];
        const nextCoords = utils.nextPosition[hero.posX, hero.posY, hero.direction];
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.posX},${object.posY}` === `${nextCoords.x},${nextCoords.y}`
        });
        if(!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events)
        }
    }

    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"];
        const match = this.cutsceneSpaces[`${hero.posX},${hero.posY}`];
        if(!this.isCutscenePlaying && match) {
            this.startCutscene( match[0].events )
        }
    }

    checkForActionCutscene() {
        const hero = this.gameObjects["hero"];
        const nextCoords = utils.nextPosition(hero.posX, hero.posY, hero.direction)
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.posX},${object.posY}` === `${nextCoords.x},${nextCoords.y}`
        });
        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events)
        }
    }

    //Wall Code
    addWall(x, y) {
        this.walls[`${x},${y}`] = true;
    }

    remWall(x, y) {
        delete this.walls[`${x},${y}`];
    }

    moveWall(wasX, wasY, dir) {
        this.remWall(wasX, wasY);
        const {x, y} = utils.nextPosition(wasX, wasY, dir);
        this.addWall(x, y);
    }
}

window.WorldMaps = {
    DemoRoom: {
        lowerSrc: "/assets/images/maps/DemoLower.png",
        upperSrc: "/assets/images/maps/DemoUpper.png",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(5), 
                y: utils.withGrid(10),
                useShadow: true, 
                isPlayer: true, 
                animationFrameLimit: 8
            }),
            bob: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(4),
                useShadow: true, 
                src: "/assets/images/characters/people/hero.png",
                behaviorLoop: [
                    { type: "idle", direction: "left", time: 800},
                    { type: "idle", direction: "up", time: 800},
                    { type: "idle", direction: "right", time: 800},
                    { type: "idle", direction: "down", time: 800},
                ],
                talking: [
                    {
                        events: [
                            { who: "bob", type: "message", text: "Why hello! You got some cheese?"},
                            { who: "bob", type: "message", text: "No? Well then I'm not sure why you're wasting my time."}
                        ]
                    }
                ]
            }),
            thug: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(5),
                useShadow: true, 
                src: "/assets/images/characters/people/white.png",
                talking: [
                    {
                        events: [
                            { who: "thug", type: "message", text: "Don't distract me!"},
                        ]
                    }
                ]
            }),
        },
        walls: {
            [utils.asGridCoord(7,6)] : true,
            [utils.asGridCoord(8,6)] : true,
            [utils.asGridCoord(7,7)] : true,
            [utils.asGridCoord(8,7)] : true,
            [utils.asGridCoord(1,3)] : true,
            [utils.asGridCoord(2,3)] : true,
            [utils.asGridCoord(3,3)] : true,
            [utils.asGridCoord(4,3)] : true,
            [utils.asGridCoord(5,3)] : true,
            [utils.asGridCoord(6,3)] : true,
            [utils.asGridCoord(6,4)] : true,
            [utils.asGridCoord(8,4)] : true,
            [utils.asGridCoord(8,3)] : true,
            [utils.asGridCoord(9,3)] : true,
            [utils.asGridCoord(10,3)] : true,
            [utils.asGridCoord(1,10)] : true,
            [utils.asGridCoord(2,10)] : true,
            [utils.asGridCoord(3,10)] : true,
            [utils.asGridCoord(4,10)] : true,
            [utils.asGridCoord(5,11)] : true,
            [utils.asGridCoord(6,10)] : true,
            [utils.asGridCoord(7,10)] : true,
            [utils.asGridCoord(8,10)] : true,
            [utils.asGridCoord(9,10)] : true,
            [utils.asGridCoord(10,10)] : true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(5, 10)] : [
                {
                    events: [
                        { type: "changeMap", map: "Custom"}
                    ]
                }
            ],
            [utils.asGridCoord(7,4)]: [
                {
                    events: [
                        { who: "thug", type: "idle", direction: 'left'},
                        { who: "thug", type: "walk", direction: "left"},
                        { who: "thug", type: "idle", direction: "up", time: 10 },
                        { who: "thug", type: 'message', text: "You can't be in there!"},
                        { who: "thug", type: "idle", direction: "up", time: 10 },
                        { who: "thug", type: "walk", direction: "right"},
                        { who: "hero", type: "walk", direction: "down"},
                        { who: "thug", type: "idle", direction: "down", time: 10 }
                    ]
                }
            ],
        }
    },
    Office: {
        // lowerSrc: "/assets/images/maps/map.png",
        // upperSrc: "/assets/images/maps/mapUpper.png",
        lowerSrc: "",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(11), 
                y: utils.withGrid(4),
                useShadow: true, 
                isPlayer: true, 
                animationFrameLimit: 8,
                src: "/assets/images/characters/people/blue.png"
            }),
            bob: new Person({
                x: utils.withGrid(3),
                y: utils.withGrid(8),
                useShadow: true, 
                src: "/assets/images/characters/people/hero.png",
                behaviorLoop: [
                    { type: "idle", direction: "left", time: 800},
                    { type: "idle", direction: "up", time: 800},
                    { type: "idle", direction: "right", time: 800},
                    { type: "idle", direction: "down", time: 800},
                ],
                talking: [
                    {
                        events: [
                            { who: "bob", type: "message", text: "Why hello! You got some cheese?"},
                            { who: "bob", type: "message", text: "No? Well then I'm not sure why you're wasting my time."}
                        ]
                    }
                ]
            }),
            allie: new Person({
                x: utils.withGrid(13),
                y: utils.withGrid(6),
                useShadow: true, 
                src: "/assets/images/characters/people/purple.png",
                talking: [
                    {
                        events: [
                            { who: "allie", type: "idle", direction: "left", time: 10},
                            { who: "allie", type: "message", text: "Don't go near that guy. He's crazy."},
                            { who: "allie", type: "idle", direction: "left", time: 100},
                            { who: "allie", type: "idle", direction: "down", time: 10},
                        ]
                    }
                ]
            }),
            clerk: new Person({
                x: utils.withGrid(3),
                y: utils.withGrid(6),
                useShadow: true, 
                src: "/assets/images/characters/people/white.png",
            }),
            clerk2: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(6),
                useShadow: true, 
                src: "/assets/images/characters/people/white.png",
            }),
        },
        walls: {
            [utils.asGridCoord(0,5)] : true,
            [utils.asGridCoord(1,5)] : true,
            [utils.asGridCoord(2,5)] : true,
            [utils.asGridCoord(3,5)] : true,
            [utils.asGridCoord(4,5)] : true,
            [utils.asGridCoord(5,5)] : true,
            [utils.asGridCoord(6,5)] : true,
            [utils.asGridCoord(7,5)] : true,
            [utils.asGridCoord(8,5)] : true,
            [utils.asGridCoord(9,5)] : true,
            [utils.asGridCoord(10,4)] : true,
            [utils.asGridCoord(11,3)] : true,
            [utils.asGridCoord(12,4)] : true,
            [utils.asGridCoord(13,5)] : true,
            [utils.asGridCoord(14,5)] : true,
            [utils.asGridCoord(15,5)] : true,
            [utils.asGridCoord(15,6)] : true,
            [utils.asGridCoord(15,15)] : true,
            [utils.asGridCoord(16,7)] : true,
            [utils.asGridCoord(16,8)] : true,
            [utils.asGridCoord(16,9)] : true,
            [utils.asGridCoord(16,10)] : true,
            [utils.asGridCoord(16,11)] : true,
            [utils.asGridCoord(16,12)] : true,
            [utils.asGridCoord(16,13)] : true,
            [utils.asGridCoord(16,14)] : true,
            [utils.asGridCoord(16,15)] : true,
            [utils.asGridCoord(7,6)] : true,
            [utils.asGridCoord(7,7)] : true,
            [utils.asGridCoord(6,7)] : true,
            [utils.asGridCoord(5,7)] : true,
            [utils.asGridCoord(4,7)] : true,
            [utils.asGridCoord(3,7)] : true,
            [utils.asGridCoord(2,7)] : true,
            [utils.asGridCoord(1,7)] : true,
            [utils.asGridCoord(1,6)] : true,
            [utils.asGridCoord(1,11)] : true,
            [utils.asGridCoord(2,11)] : true,
            [utils.asGridCoord(3,11)] : true,
            [utils.asGridCoord(1,12)] : true,
            [utils.asGridCoord(2,12)] : true,
            [utils.asGridCoord(1,13)] : true,
            [utils.asGridCoord(2,13)] : true,
            [utils.asGridCoord(3,13)] : true,
            [utils.asGridCoord(5,11)] : true,
            [utils.asGridCoord(6,11)] : true,
            [utils.asGridCoord(7,11)] : true,
            [utils.asGridCoord(6,12)] : true,
            [utils.asGridCoord(7,12)] : true,
            [utils.asGridCoord(5,13)] : true,
            [utils.asGridCoord(6,13)] : true,
            [utils.asGridCoord(7,13)] : true,
            [utils.asGridCoord(-1,6)] : true,
            [utils.asGridCoord(-1,7)] : true,
            [utils.asGridCoord(-1,8)] : true,
            [utils.asGridCoord(-1,9)] : true,
            [utils.asGridCoord(-1,10)] : true,
            [utils.asGridCoord(-1,11)] : true,
            [utils.asGridCoord(-1,12)] : true,
            [utils.asGridCoord(-1,13)] : true,
            [utils.asGridCoord(-1,14)] : true,
            [utils.asGridCoord(-1,15)] : true,
            [utils.asGridCoord(0,16)] : true,
            [utils.asGridCoord(1,16)] : true,
            [utils.asGridCoord(2,16)] : true,
            [utils.asGridCoord(3,16)] : true,
            [utils.asGridCoord(4,16)] : true,
            [utils.asGridCoord(5,16)] : true,
            [utils.asGridCoord(6,16)] : true,
            [utils.asGridCoord(7,16)] : true,
            [utils.asGridCoord(8,16)] : true,
            [utils.asGridCoord(9,16)] : true,
            [utils.asGridCoord(10,16)] : true,
            [utils.asGridCoord(11,16)] : true,
            [utils.asGridCoord(12,16)] : true,
            [utils.asGridCoord(13,16)] : true,
            [utils.asGridCoord(14,16)] : true,
            [utils.asGridCoord(15,16)] : true,

        },
        cutsceneSpaces: {
            [utils.asGridCoord(11, 4)] : [
                {
                    events: [
                        { type: "changeMap", map: "Custom"}
                    ]
                }
            ],
        },
    },
    Custom: {
        lowerSrc: "/assets/images/maps/Custom2Lower.png",
        upperSrc: "/assets/images/maps/Custom2Upper.png",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(21), 
                y: utils.withGrid(25),
                useShadow: true, 
                isPlayer: true, 
                animationFrameLimit: 8
            })
        },
        walls: {
            [utils.asGridCoord(18,24)] : true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(21, 24)] : [
                {
                    events: [
                        { type: "changeMap", map: "Office"}
                    ]
                }
            ],
        },
    },
    Procedural: {
        lowerSrc: "",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(64), 
                y: utils.withGrid(64),
                useShadow: true, 
                isPlayer: true, 
                animationFrameLimit: 8,
                src: "/assets/images/characters/people/blue.png"
            })
        },
        cutsceneSpaces: {
            [utils.asGridCoord(21, 24)] : [
                {
                    events: [
                        { type: "changeMap", map: "Office"}
                    ]
                }
            ],
        },
    }

}