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
                return 3.8;
            case width > 720 && width <= 1024:
                return 3;
            case width > 1024:
            default:
                return 4.8;
        }
    },
    //We're looking at pathfinding algorithms here but I'm honestly not sure yet.
    findPath({start, end, map}) {
        var map = map;
        
        for(var x = 0; x < map.length; x++) {
            for(var y = 0; y < map[x].length; y++) {
                map[x][y].f = 0;
                map[x][y].g = 0;
                map[x][y].h = 0;
                map[x][y].debug = '';
                map[x][y].parent = null;
            }
        }

        var openList = [];
        var closedList = [];
        openList.push(start);
        while(openList.length > 0) {
            var lowInd = 0;
            for(var i = 0; i < openList.length; i++) {
                if(openList[i].f < openList[lowInd].f) { lowInd = i; }d;
            }
            var currentNode = openList[lowInd];

            if(currentNode.pos == end.pos) {
                var curr = currentPos;
                var ret = [];
                while(curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            openList.removeGraphNode(currentNode);
            closedList.push(currentNode);

            var neighbors = utils.neighbors(map, currentNode);

            for(var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if(closedList.findGraphNode(neighbor) || neighbor.isWall()) {
                    continue;
                }

                var gScore = currentNode.g + 1;
                var gScoreIsBest = false;

                if(!openList.findGraphNode(neighbor)) {
                    gScoreIsBest = true;
                    neighbor.h = utils.heuristic(neighbor.pos, end.pos);
                    openList.push(neighbor);
                } else if(gScore < neighbor.g) {
                    gScoreIsBest = true;
                }

                if(gScoreIsBest) {
                    neighbor.parent = currentNode;
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.debug = `F: ${neighbor.f}<br/>G: ${neighbor.g}<br/>H: ${neighbor.h}`;
                }
            }
        }

        return [];
    },
    heuristic(pos0, pos1) {
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abd(pos1.y - pos0.y);
        return d1 + d2;
    },
    neighbors(map, node) {
        var ret = [];
        var x = node.pos.x;
        var y = node.pos.y;

        if(map[x-1] && map[x-1][y]) {
            ret.push(grid[x-1][y]);
        }
        if(map[x+1] && map[x+1][y]) {
            ret.push(grid[x+1][y]);
          }
          if(map[x][y-1] && map[x][y-1]) {
            ret.push(grid[x][y-1]);
          }
          if(map[x][y+1] && map[x][y+1]) {
            ret.push(grid[x][y+1]);
          }
          return ret;
    },
    
}