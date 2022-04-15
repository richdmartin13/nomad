class WorldMap {
    constructor(config) {
        this.world = null;
        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.custom = config.custom;
        this.mapSize = config.mapSize;
        this.tileSize = config.tileSize;

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
            cactus: 6
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
            0: { sprite: { x: 0, y: 0, w: 16, h: 16 } },
            1: { sprite: { x: 16, y: 0, w: 16, h: 16 } },
            2: { sprite: { x: 32, y: 0, w: 16, h: 16 } },
            3: { sprite: { x: 48, y: 0, w: 16, h: 16 } }
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
                    tileSize.y);
            }
        }
        // console.log(this.walls)
    }

    getMap() {
        return this.map;
    }

    addTerrainObjects(mapSize) {
        for (var y = 0; y < mapSize.y; y++) {
            for (var x = 0; x < mapSize.x; x++) {
                var value = this.map[x][y];
                var spawn = Math.floor(Math.random() * 100);
                var source = null;
                var placeObject = false;

                switch (true) {
                    case value > 0.4:
                        //rocks spawn code
                        if (spawn > 100 - this.spawnRates.rock) {
                            source = '/assets/images/world/rocks.png';
                            placeObject = true;
                        }
                    case value > 0.4 && value < 0.8:
                        //tree spawn code
                        if (spawn > 100 - this.spawnRates.tree) {
                            source = '/assets/images/world/bush.png';
                            placeObject = true;
                        }
                        break;
                    case value > 0.3 && value < 0.4:
                        //cactus spawn code
                        if (spawn > 100 - this.spawnRates.cactus) {
                            source = '/assets/images/world/cactus.png';
                            placeObject = true;
                        }
                        break;
                    default:

                        break;
                }

                if (placeObject) {
                    this.gameObjects[`${x},${y}`] = new TerrainObject({
                        x: utils.withGrid(x),
                        y: utils.withGrid(y),
                        src: source
                    });
                }

            }
        }
    }
    //
    // End Test Map Code
    //
    //

    isSpaceTaken(curX, curY, dir) {
        const { x, y } = utils.nextPosition(curX, curY, dir);
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

    checkForActionCutscene() {
        const hero = this.gameObjects["hero"];
        const nextCoords = utils.nextPosition[hero.posX, hero.posY, hero.direction];
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.posX},${object.posY}` === `${nextCoords.x},${nextCoords.y}`
        });
        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events)
        }
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