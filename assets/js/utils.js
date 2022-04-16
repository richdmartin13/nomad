const utils = {
    withGrid(n) {
        return n * 16;
    },
    asGridCoord(x,y) {
        return `${x*16},${y*16}`
    },
    nextPosition(initX, initY, dir) {
        let x = initX;
        let y = initY;
        const size = 16;
        
        if (dir === "left") {
            x -= size;
        } else if (dir === "right") {
            x += size;
        } else if (dir === "up") {
            y -= size;
        } else if (dir === "down") {
            y += size;
        }

        return {x, y}
    },
    emitEvent(name, detail) {
        const event = new CustomEvent(name, {
            detail
        });
        document.dispatchEvent(event);
    },
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    },
    getScalingFactor() {
        var width = window.innerWidth;

        switch (true) {
            case width <= 720:
                return 3.4;
            case width > 720 && width <= 1024:
                return 3;
            case width > 1024:
            default:
                return 4.8;
        }
    },
}