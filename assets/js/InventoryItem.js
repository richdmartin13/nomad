class InventoryItem {
    constructor({who, src, type, item}) {
        this.id = null;
        this.src = src;
        this.type = type;
        this.item = item;
        this.img = new Image();

        this.init();
    }

    init() {
        this.img.src = this.src;
        this.id = this.item;
    }

    get() {
        return this;
    }

}