class Menu {
    constructor() {
        this.src = '/assets/images/ui/menu.png';
        this.options = {

        }

        this.sprites = {
            'tl': { sprite: { x: 0, y: 0, w: 16, h: 16} },
            'tc': { sprite: { x: 16, y: 0, w: 16, h: 16} },
            'tr': { sprite: { x: 32, y: 0, w: 16, h: 16} },
            'ml': { sprite: { x: 0, y: 16, w: 16, h: 16} },
            'mc': { sprite: { x: 16, y: 16, w: 16, h: 16} },
            'mr': { sprite: { x: 32, y: 16, w: 16, h: 16} },
            'bl': { sprite: { x: 0, y: 32, w: 16, h: 16} },
            'bc': { sprite: { x: 16, y: 32, w: 16, h: 16} },
            'br': { sprite: { x: 32, y: 32, w: 16, h: 16} },
        }
        this.sprite = null;
    }

    draw({context}) {
        if (context === null) { return; }
        var tileset = new Image();
        tileset.src = this.src;
        var xstart = utils.withGrid(9);
        var ystart = utils.withGrid(5);

        var grid = [
            ['tl', 'tc', 'tc', 'tc', 'tc', 'tc', 'tr'],
            ['ml', 'mc', 'mc', 'mc', 'mc', 'mc', 'mr'],
            ['ml', 'mc', 'mc', 'mc', 'mc', 'mc', 'mr'],
            ['ml', 'mc', 'mc', 'mc', 'mc', 'mc', 'mr'],
            ['ml', 'mc', 'mc', 'mc', 'mc', 'mc', 'mr'],
            ['ml', 'mc', 'mc', 'mc', 'mc', 'mc', 'mr'],
            ['bl', 'bc', 'bc', 'bc', 'bc', 'bc', 'br'],
        ]

        for(var x = 0; x < 7; x++ ) {
            for(var y = 0; y < 7; y++ ) {
                console.log(`drew from ${tileset.src}, ${this.sprites[grid[x][y]].sprite.x},
                ${this.sprites[grid[x][y]].sprite.y}, at position ${xstart}, ${ystart}`)
                context.drawImage(
                    tileset, 
                    this.sprites[grid[x][y]].sprite.x,
                    this.sprites[grid[x][y]].sprite.y,
                    16, 16,
                    xstart, ystart,
                    16, 16
                )
                xstart += 16;
            }
            xstart = utils.withGrid(9);
            ystart +=16;
        }
    }
}