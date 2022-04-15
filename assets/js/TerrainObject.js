class TerrainObject extends GameObject {
    constructor(config) {
        super(config);

        this.type = config.type;
        this.callback = config.callback || null;

        this.offset = { x: 0, y: 0 }

        this.sprite.setOffset(this.offset);

        switch(this.type) {
            case 'rock': 
                this.sprite.setSRC('/assets/images/world/rocks.png');
                break;
            case 'bush':
                this.sprite.src = '/assets/images/world/bush.png';
                break;
            case 'cactus':
                this.sprite.src = '/assets/images/world/cactus.png';
                break;
            default: 
                this.sprite.src = '/assets/images/error.png';
                break;
        }
    }
}