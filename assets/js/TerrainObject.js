class TerrainObject extends GameObject {
    constructor(config) {
        super(config);

        this.type = config.type;
        this.callback = config.callback || null;

        this.offset = { x: 0, y: 0 }

        this.sprite.setOffset(this.offset);
    }
}