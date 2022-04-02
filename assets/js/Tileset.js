class Tileset {
    constructor(config) {
        this.type = config.type;
        this.src = config.src;
        this.resolution = config.res || 32;
        this.isLoaded = false;
    }

    createBlock() {
        var tileset = new Image();
        tileset.src = this.src;
        var faces = [];

        tileset.onload = () => {
           this.isLoaded = true;
        }

        for( let i = 0; i < tileset.width / this.resolution; i++) {
            for( let j = 0; j < tileset.height / this.resolution; j++) {
                faces.push([i, j]);
            }
        }

        console.log(2,8,14,20,26);
        
        return faces;
    }
}