class InventoryItem {
    constructor({ item }) {
        this.id = null;
        this.src = null;
        this.type = null;
        this.item = item;
        this.img = new Image();

        this.init();
    }

    init() {
        this.src = this.getTexture();
        this.img.src = this.src;
        this.id = `${this.item}${Math.floor(Math.random()*4)}${Math.floor(Math.random()*16)}${Math.floor(Math.random()*8)}${Math.floor(Math.random()*32)}`;
        this.type = this.getType();
    }

    get() {
        return this;
    }

    getType() {
        return this.type;
    }

    getTexture() {
        switch (true) {
            case this.item == 'log':
                return '/assets/images/items/wood.png';
            case this.item == 'apple':
                return '/assets/images/items/apple.png';
            case this.item == 'rock':
                return '/assets/images/items/rock.png';
            case this.item == 'iron':
                return '/assets/images/items/iron.png';
        }
    }

}