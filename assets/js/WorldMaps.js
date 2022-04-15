window.WorldMaps = {
    Procedural: {
        mapSize: {x: 128, y: 128},
        tileSize: {x: 16, y: 16},
        lowerSrc: "",
        upperSrc: "",
        custom: false,
        gameObjects: {
            hero: new Person({
                useShadow: true, 
                isPlayer: true, 
                animationFrameLimit: 8,
                src: "/assets/images/characters/people/blue.png",
            }),
            nomad: new Person({
                useShadow: true, 
                src: "/assets/images/characters/people/blue.png",
                talking: [
                    {
                        events: [
                            { who: "nomad", type: "idle", direction: 'right', time: 10 },
                            { who: "blue", type: "message", text: "Hey there!"},
                            { who: "blue", type: "message", text: "I see you've stumbled upon this place."},
                            { who: "blue", type: "message", text: "I'm not sure where we are, or how we get out."},
                            { who: "blue", type: "message", text: "I figure you could take a look around for now?"},
                            { who: "nomad", type: "idle", direction: 'down', time: 10 },
                        ]
                    }
                ]
            }),
            nomad2: new Person({
                useShadow: true, 
                src: "/assets/images/characters/people/rich.png",
                talking: [
                    {
                        events: [
                            { who: "nomad2", type: "idle", direction: 'left', time: 10 },
                            { who: "Rich", type: "message", text: "Ahh, you want to go back to the office?"},
                            { who: "Rich", type: "message", text: "That makes sense. There's not a lot to do here."},
                            { who: "Rich", type: "message", text: "Nonetheless, I'm glad you stopped by. I look forward to seeing you again!"},
                            { type: 'changeMap', map: 'Office'}
                        ]
                    }
                ]
            }),
        },
    },
    Office: {
        lowerSrc: "/assets/images/maps/map.png",
        upperSrc: "/assets/images/maps/mapUpper.png",
        custom: true,
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
                        { who: 'game', type: 'message', text: 'You are about to enter the procedural world.'},
                        { who: 'game', type: 'message', text: 'Talk to Rich to get back here.'},
                        { type: "changeMap", map: "Procedural"}
                    ]
                }
            ],
        },
    },

}