class TileMap {
    constructor(config) {
        //context, src, dimensions
        this.context = config.context;
        this.tileSize = config.tileSize || { w: 16, h: 16 }
        this.dimensions = config.dimensions || { x: 256, y: 256 };

        //set up the image
        this.image = new Image();
        this.image.src = config.src || "/assets/atlas/terrain.png";
        this.image.onload = () => {
            this.isLoaded = true;
        }

        this.grass = new Tile({
            type: 'grass'
        });
        this.dirt = new Tile({
            type: 'dirt'
        });
        this.sand = new Tile({
            type: 'sand'
        })

        this.map = [...Array(this.dimensions.x)].map(e => Array(this.dimensions.y));

    }


    init(context) {
        this.buildMap();
    }

    get() {
        return this.map();
    }

    buildMap() {
        for (var x = 0; x < this.dimensions.x; x++) {
            for (var y = 0; y < this.dimensions.y; y++) {

                //using tiles, my way
                 var value = noise.simplex2(x / 100, y / 100);

                // // this.map[x][y] = Math.abs(value) * 1;
                // var val = Math.abs(value) * 1;
                // var kind = 'water';
                // switch (true) {
                //     case val < 0.5:
                //         kind = 'water';
                //         break;
                //     case val > 0.5 && val < 0.75:
                //         kind = 'sand';
                //         break;
                //     case val > 0.75 && val < 0.9:
                //         kind = 'grass';
                //         break;
                //     case val > 0.9:
                //         kind = 'dirt';
                //         break;
                // }

                // this.map[x][y] = new Tile({type: kind});
                // console.log(this.map[x][y].type)

                this.map[x][y] = Math.abs(value) * 1;
            }
        }
    }

    renderMap() {
        for (var x = 0; x < this.dimensions.x; x++) {
            for (var y = 0; y < this.dimensions.y; y++) {
                var value = noise.simplex2(x / 100, y / 100);

                var val = this.map[((y*this.dimensions.x + x))];
                switch (val) {
                    case val < 0.5:
                        this.context.fillStyle="#006EE6"
                        break;
                    case val > 0.5 && val < 0.75:
                        this.context.fillStyle="#C28280"
                        break;
                    case val > 0.75 && val < 0.9:
                        this.context.fillStyle="#79D021"
                        break;
                    case val > 0.9:
                        this.context.fillStyle="#9B7653"
                        break;
                }
                this.context.fillRect(x*this.tileSize.w, y*this.tileSize.h, this.tileSize.w, this.tileSize.h)
            }
        }
        // console.log("map rendered")
    }

}