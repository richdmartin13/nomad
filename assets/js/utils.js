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
    }
}