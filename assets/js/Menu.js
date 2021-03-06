class Menu {
    constructor({debug, closeMenu, gamepad, isOpen, title}, options) {
        this.title = title || 'Menu';
        this.background = new Image();
        this.background.src = '/assets/images/ui/menu.png';
        this.button = new Image();
        this.button.src = '/assets/images/ui/button.png';
        this.rect = null;
        this.isOpen = isOpen;
        this.showGamePad = true;
        this.map = null;
        this.options = options || {
            refresh: {
                name: "Restart Map",
                action: () => { location.reload() },
                x: utils.withGrid(10.5),
                y: utils.withGrid(7),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            debug: {
                name: "Debug Mode",
                action: debug,
                x: utils.withGrid(10.5),
                y: utils.withGrid(8),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            gamepad: {
                name: "Show Gamepad",
                action: gamepad,
                x: utils.withGrid(10.5),
                y: utils.withGrid(9),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            },
            close: {
                name: "Close Menu",
                action: closeMenu,
                x: utils.withGrid(10.5),
                y: utils.withGrid(11.5),
                containsPoint: (x, y, key) => this.containsPoint(x, y, key)
            }
        }
    }

    init(rect) {
        var buttonHandler = this.buttonHandler;
        var options = this.options;
        var isOpen = this.isOpen;
        this.handler = function(e) {
            buttonHandler(e, rect, options, isOpen);
        }
    }

    draw({context}) {
        context.drawImage(
            this.background,
            utils.withGrid(9.5), utils.withGrid(6),
            96, 112
        )

        context.fillStyle = '#212121';
        context.font = '6px "Press Start 2P"'
        context.fillText(this.title, utils.withGrid(10.45), utils.withGrid(6.85))

        Object.values(this.options).forEach(object => {
            var x = object.x;
            var y = object.y;

            context.drawImage(this.button, x, y);

            context.font = '5px "Press Start 2P"';
            context.fillStyle='#FFF';
            context.fillText(object.name, x + 3, y+11);
        })
        
    }

    bindClick(isOpen) {
        this.isOpen = isOpen;

        if(this.isOpen) {
            document.querySelector(".game-canvas").addEventListener("pointerup", this.handler);
        } else {
            document.querySelector(".game-canvas").removeEventListener("pointerup", this.handler);
        }
    }

    buttonHandler(e, rect, options) {
        const x = ((e.clientX - rect.left) / 16) / utils.getScalingFactor()
        const y = ((e.clientY - rect.top) / 16) / utils.getScalingFactor()

        Object.keys(options).forEach(key => {
            if (options[key].containsPoint(x, y, key)) {
                options[key].action();
            }
        });
    }

    containsPoint(x, y, key) {
        var active = null;

        Object.keys(this.options).forEach(k => {
            if(key == k) {
                if (x < this.options[key].x/16 - 0.1 || x > this.options[key].x/16 + 5.1 || y < this.options[key].y/16 - 0.1 || y > this.options[key].y/16 + 1) {
                    active = null;
                } else {
                    active = key;
                }
            }
        })

        return active === key;
    }
}