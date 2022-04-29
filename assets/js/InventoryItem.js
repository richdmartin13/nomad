class InventoryItem {
    constructor({ item }) {
        this.id = null;
        this.src = null;
        this.type = null;
        this.item = item;
        this.img = new Image();
        this.isSelected = false;

        this.init();
    }

    init() {
        this.src = this.getTexture();
        this.img.src = this.src;
        this.id = `${this.item}${Math.floor(Math.random() * 4)}${Math.floor(Math.random() * 16)}${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 32)}`;
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
            case this.item == 'chest':
                return '/assets/images/items/chest.png';
            case this.item == 'tool':
                return '/assets/images/items/tool-ph.png';
            case this.item == 'block':
                return '/assets/images/items/block-ph.png'
            case this.item == 'food':
                return '/assets/images/items/food-ph.png'
            case this.item == 'armor':
                return '/assets/images/items/shield-ph.png'
        }
    }

}