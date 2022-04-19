class WorldMap {
    constructor(config) {
        this.id = config.id;
        this.world = null;
        this.gameObjects = config.gameObjects;
        this.initialGameObjects = config.gameObjects;
        this.walls = config.walls || {};
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.custom = config.custom;
        this.mapSize = config.mapSize;
        this.tileSize = config.tileSize;
        this.fpsCompensation = config.fpsCompensation || 1;

        this.lower = new Image();
        this.lower.src = config.lowerSrc;
        if (config.lowerSrc.length > 0) {
            this.isCustom = true;
        }

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

        this.spawnRates = {
            rock: 12,
            tree: 8,
            appleTree: 4,
            cactus: 6,
            leaves: 20,
            waterRock: 4,
            waves: 12
        }

        this.init();
    }

    init() {
        this.tileset = new Image();
        this.tileset.src = this.tilesetURL;
        this.tileset.onload = () => {
            this.tilesetLoaded = true;
        }
    }

    drawLower(context, cameraMan) {
        context.drawImage(this.lower,
            utils.withGrid(12) - cameraMan.posX,
            utils.withGrid(14) - cameraMan.posY
        );
    }

    drawUpper(context, cameraMan) {
        context.drawImage(this.upper,
            utils.withGrid(12) - cameraMan.posX,
            utils.withGrid(14) - cameraMan.posY
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

        var sprites = {
            sand: { sprite: { x: 0, y: 0, w: 16, h: 16 } },
            grass: { sprite: { x: 16, y: 0, w: 16, h: 16 } },
            dirt: { sprite: { x: 32, y: 0, w: 16, h: 16 } },
            sandE: { sprite: { x: 0, y: 16, w: 16, h: 16 } },
            grassE: { sprite: { x: 16, y: 16, w: 16, h: 16 } },
            dirtE: { sprite: { x: 32, y: 16, w: 16, h: 16 } },
            water: { sprite: { x: 48, y: 0, w: 16, h: 16 } },
            waterL: { sprite: { x: 48, y: 16, w: 16, h: 16 }},
            waterC: { sprite: { x: 64, y: 0, w: 16, h: 16 } },
            waterR: { sprite: { x: 64, y: 16, w: 16, h: 16 }},
        }
        var sprite = null;

        for (var y = 0; y < mapSize.y; y++) {
            for (var x = 0; x < mapSize.x; x++) {
                var value = this.map[x][y];

                switch (true) {
                    case value > 0.3 && value < 0.4:
                        sprite = sprites.sand.sprite;
                        if (this.map[x][y + 1] < 0.3) {
                            sprite = sprites.sandE.sprite;
                            this.addWall(utils.withGrid(x), utils.withGrid(y))
                        }
                        ctx.fillStyle = this.colors.sand;
                        break;
                    case value > 0.4 && value < 0.9:
                        sprite = sprites.grass.sprite;
                        // if(this.map[x][y+1] < 0.4) {
                        //     sprite = sprites.grassE.sprite;
                        // }
                        ctx.fillStyle = this.colors.grass;
                        break;
                    case value > 0.9:
                        sprite = sprites.dirt.sprite;
                        // if(this.map[x][y+1] < 0.9) {
                        //     sprite = sprites.dirtE.sprite;
                        // }
                        ctx.fillStyle = this.colors.dirt;
                        break;
                    case value < 0.3:
                    default:
                        sprite = sprites.water.sprite;
                        if (this.map[y-1] && this.map[x][y - 1] >= 0.3) {
                            sprite = sprites.waterC.sprite;
                            if(this.map[y-1] && this.map[x+1] && this.map[x+1][y-1] <= 0.3) {
                                sprite = sprites.waterR.sprite;
                            } 
                            if(this.map[y-1] && this.map[x-1] && this.map[x-1][y-1] <= 0.3) {
                                sprite = sprites.waterL.sprite;
                            }
                        }
                        ctx.fillStyle = this.colors.water;
                        this.addWall(utils.withGrid(x), utils.withGrid(y))
                        break;
                }

                if(this.tilesetLoaded) {
                    ctx.drawImage(
                        this.tileset,
                        sprite.x, sprite.y,
                        sprite.w, sprite.h,
                        utils.withGrid(12) + utils.withGrid(x) - cameraMan.posX,
                        utils.withGrid(14) + utils.withGrid(y) - cameraMan.posY,
                        tileSize.x, tileSize.y
                    )
                }
                
            }
        }
    }

    getMap() {
        return this.map;
    }

    addTerrainObjects(mapSize) {
        this.resetTerrainObjects()

        for (var y = 0; y < mapSize.y; y++) {
            for (var x = 0; x < mapSize.x; x++) {
                var value = this.map[x][y];
                var spawn = Math.floor(Math.random() * 100);
                var source = null;
                var type = null;
                var leafSource = null;
                var waveSource = null;
                var placeObject = false;
                var placeLeaves = false;
                var placeWaves = false;

                switch (true) {
                    case value < 0.3:
                        if(spawn > 100 - this.spawnRates.waterRock) {
                            var tex = Math.floor(Math.random() * 2);
                            source = `/assets/images/world/waterrock${tex}.png`;
                            placeObject = true;
                            type = 'waterrock';
                        }
                    break;
                    case value > 0.4:
                        //rocks spawn code
                        if (spawn > 100 - this.spawnRates.rock) {
                            var tex = Math.floor(Math.random() * 6);
                            source = `/assets/images/world/rocks${tex}.png`;
                            placeObject = true;
                            type = 'rock';
                        }
                    case value > 0.5: 
                        var aspawn = Math.floor(Math.random() * 100);
                        if(aspawn > 100 - this.spawnRates.appleTree) {
                            source = '/assets/images/world/bush1.png'
                            placeObject = true;
                            type = 'appleTree';
                        }
                    case value > 0.4 && value < 0.8:
                        //tree spawn code
                        if (spawn > 100 - this.spawnRates.tree) {
                            // var tex = Math.floor(Math.random() * 2);
                            var tex = 0;
                            source = `/assets/images/world/bush${tex}.png`;
                            placeObject = true;
                            type = 'tree';
                        }
                        break;
                    case value > 0.3 && value < 0.4:
                        //cactus spawn code
                        if (spawn > 100 - this.spawnRates.cactus) {
                            var tex = Math.floor(Math.random() * 2);
                            source = `/assets/images/world/cactus${tex}.png`;
                            placeObject = true;
                            type = 'cactus';
                        }
                        break;
                    default:
                        if(spawn > 100 - this.spawnRates.waterRock) {
                            var tex = Math.floor(Math.random() * 2);
                            source = `/assets/images/world/waterrock${tex}.png`;
                            placeObject = true;
                            type = 'waterrock';
                        }
                        break;
                }

                spawn = Math.floor(Math.random() * 100);

                switch (true) {
                    case value > 0.4 && value < 0.8:
                        //leaves spawn code
                        if (spawn > 100 - this.spawnRates.leaves) {
                            var tex = Math.floor(Math.random() * 6);
                            leafSource = `/assets/images/world/leaves${tex}.png`;
                            placeLeaves = true;
                        }
                        break;
                    case value < 0.1: 
                        //waves spawn code
                        if(spawn > 100 - this.spawnRates.waves) {
                            var tex = Math.floor(Math.random() * 3);
                            waveSource = `/assets/images/world/wave${tex}.png`;
                            placeWaves = true;
                            type = 'wave';
                        }
                    break;
                }

                if (this.map[x][y + 1] < 0.3 && type !== 'waterrock') {
                    // console.log(x, y)
                    placeObject = false;
                }

                if (placeObject) {
                    this.gameObjects[`${x},${y}`] = new TerrainObject({
                        x: utils.withGrid(x),
                        y: utils.withGrid(y),
                        src: source,
                        type: type
                    });
                }

                if (placeLeaves) {
                    this.gameObjects[`${x},${y}`] = new TerrainObject({
                        x: utils.withGrid(x),
                        y: utils.withGrid(y),
                        src: leafSource,
                        collision: false
                    });
                }

                if (placeWaves) {
                    this.gameObjects[`${x},${y}`] = new TerrainObject({
                        x: utils.withGrid(x),
                        y: utils.withGrid(y),
                        src: waveSource,
                        collision: false
                    });
                }

            }
        }
    }

    removeGameObject(x, y) {

        const match = Object.values(this.gameObjects).find(object => {
            return `${object.posX},${object.posY}` === `${x},${y}`
        });
        this.remWall(this.gameObjects[match.id].posX, this.gameObjects[match.id].posY);
        delete this.gameObjects[match.id];
    }

    resetTerrainObjects() {
        Object.keys(this.gameObjects).forEach(key => {
            if(key.includes(',')) {
                console.log(`removing entity ${key.id}`);
                delete this.gameObjects[key.id];
            }
        })
    }

    getRandomSpawn() {
        var x = Math.floor(Math.random() * this.mapSize.x),
            y = Math.floor(Math.random() * this.mapSize.y) + 1;
        var retry = true;

        while (retry) {
            if (this.isTaken(x, y) || this.map[x][y] <= 0.3) {
                // console.log(`space taken at ${x},${y}`)
                x = Math.floor(Math.random() * this.mapSize.x);
                y = Math.floor(Math.random() * this.mapSize.y);
            } else {
                retry = false;
            }
        }

        return { x: utils.withGrid(x), y: utils.withGrid(y) };
    }
    //
    // End Test Map Code
    //
    //

    isSpaceTaken(curX, curY, dir) {
        const { x, y } = utils.nextPosition(curX, curY, dir);
        return this.walls[`${x},${y}`] || false
    }

    isTaken(curX, curY) {
        const { x, y } = {curX, curY};
        return this.walls[`${x},${y}`] || false
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {
            let object = this.gameObjects[key];
            object.id = key;
            object.sprite.animationFrameLimit = 8/this.fpsCompensation;

            if (`${object.posX},${object.posY}` == '0,0') {
                var position = this.getRandomSpawn();
                object.setPosition(position);
            }

            object.mount(this);
        })
        console.log(this.gameObjects)
    }

    //Cutscene Code
    async startCutscene(events) {
        this.isCutscenePlaying = true;

        for (let i = 0; i < events.length; i++) {
            const eventHandler = new WorldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;

        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }

    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"];
        const match = this.cutsceneSpaces[`${hero.posX},${hero.posY}`];
        if (!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events)
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
        const { x, y } = utils.nextPosition(wasX, wasY, dir);
        this.addWall(x, y);
    }

    drawWorldBorder(mapSize) {
        for (var x = 0; x <= mapSize.x; x++) {
            this.addWall(utils.withGrid(x), utils.withGrid(-1));
            this.addWall(utils.withGrid(x), utils.withGrid(mapSize.y))
        }
        for (var y = 0; y <= mapSize.y; y++) {
            this.addWall(utils.withGrid(-1), utils.withGrid(y));
            this.addWall(utils.withGrid(mapSize.x), utils.withGrid(y))
        }
    }
}