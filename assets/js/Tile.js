class Tile {
    constructor(config) {
        this.atlas = []
        this.size = {w: 3, h: 3}
        this.atlasKey = {
            0: 'TL', 1: 'TC', 2: 'TR',
            3: 'ML', 4: 'MC', 5: 'MR',
            6: 'BL', 7: 'BC', 8: 'BR'
        }
        this.type = config.type || 'grass';
        this.path = null;
    }

    init() {
        this.path = `/assets/atlas/${this.type}/`

        for( let i = 0; i < this.size.w; i++ ) {
            this.atlas.push( [] );
        }

        var Index = 1;
        for( let x = 0; x < this.size.w; x++ ) {
            for( let y = this.atlas[x].length; y < this.size.h; y++ ) {
                this.atlas[x].push(new Image().src = `${this.path}${this.atlasKey[3 * x + y]}.png`)
            }
        }

        console.log(this.atlas);

    }
}