class TerrainObject extends GameObject {
    constructor(config) {
        super(config);

        this.type = config.type;

        this.callback = config.callback || null;
        // this.hasItem = Math.random() * 100 > 50;
        this.hasItem = true;
        this.item = null;

        this.offset = { x: 0, y: 0 }

        this.sprite.setOffset(this.offset);
        this.talking = [];

        this.init();
    }

    init() {
        if(this.hasItem) {
            switch(true) {
                case this.type == 'tree':
                    this.item = Math.random() * 100 > 70 ? 'apple' : 'wood';
                    break;
                case this.type == 'rock':
                    this.item = Math.random() * 100 > 70 ? 'iron' : 'rock';
                    break;
            }
            this.talking.push({ events : { who: "hero", type: "collectItem", item: this.item}})
        }
    }
}