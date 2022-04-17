class TerrainObject extends GameObject {
    constructor(config) {
        super(config);

        this.type = config.type;
        this.callback = config.callback || null;
        this.hasItem = Math.random() * 100 > 50;

        this.offset = { x: 0, y: 0 }

        this.sprite.setOffset(this.offset);
    }
}