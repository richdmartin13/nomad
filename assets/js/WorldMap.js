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
    }

    drawLower(context, cameraMan) {
        context.drawImage(this.lower,
             utils.withGrid(10.5) - cameraMan.posX, 
             utils.withGrid(6) - cameraMan.posY
             );
    }

    drawUpper(context, cameraMan) {
        context.drawImage(this.upper,              
            utils.withGrid(10.5) - cameraMan.posX, 
            utils.withGrid(6) - cameraMan.posY
        )
    }

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
                x: utils.withGrid(7), 
                y: utils.withGrid(3),
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
                ]
            }),
            thug: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(5),
                useShadow: true, 
                src: "/assets/images/characters/people/hero.png",
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
                        { type: "changeMap", map: "Street"}
                    ]
                }
            ],
            [utils.asGridCoord(7,4)]: [
                {
                    events: [
                        { who: "thug", type: "walk", direction: "left"},
                        { who: "thug", type: "idle", direction: "up", time: 500 },
                        { who: "thug", type: "walk", direction: "right"},
                        { who: "hero", type: "walk", direction: "down"},
                        { who: "thug", type: "idle", direction: "down", time: 10 }
                    ]
                }
            ],
        }
    },
    Street: {
        lowerSrc: "/assets/images/maps/StreetLower.png",
        upperSrc: "/assets/images/maps/StreetUpper.png",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(5), 
                y: utils.withGrid(10),
                useShadow: true, 
                isPlayer: true, 
                animationFrameLimit: 8
            }),
        },
        walls: {
            [utils.asGridCoord(7,6)] : true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(5, 9)] : [
                {
                    events: [
                        { type: "changeMap", map: "DemoRoom"}
                    ]
                }
            ],
            [utils.asGridCoord(25, 5)] : [
                {
                    events: [
                        { type: "changeMap", map: "North"}
                    ]
                }
            ]
        },
    },
    North: {
        lowerSrc: "/assets/images/maps/StreetNorthLower.png",
        upperSrc: "/assets/images/maps/StreetNorthUpper.png",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(7), 
                y: utils.withGrid(16),
                useShadow: true, 
                isPlayer: true, 
                animationFrameLimit: 8
            })
        },
        walls: {
            [utils.asGridCoord(7,6)] : true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(7, 16)] : [
                {
                    events: [
                        { type: "changeMap", map: "Street"}
                    ]
                }
            ],
        },
    }

}