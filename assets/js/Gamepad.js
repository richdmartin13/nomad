class GamePad {
    constructor({ buttonSize }) {
        this.buttonSize = buttonSize || 16;

        this.buttons = {
            up: {
                src: '/assets/images/ui/up.png',
                x: 10, y: 16.5,
                size: buttonSize,
                keyCode: "ArrowUp"
            },
            down: {
                src: '/assets/images/ui/down.png',
                x: 10, y: 18,
                size: buttonSize,
                keyCode: "ArrowDown"
            },
            left: {
                src: '/assets/images/ui/left.png',
                x: 9.25, y: 17.25,
                size: buttonSize,
                keyCode: "ArrowLeft"
            },
            right: {
                src: '/assets/images/ui/right.png',
                x: 10.75, y: 17.25,
                size: buttonSize,
                keyCode: "ArrowRight"
            },
            a: {
                src: '/assets/images/ui/a.png',
                x: 14, y: 16.75,
                size: buttonSize,
                keyCode: "Enter"
            },
            b: {
                src: '/assets/images/ui/b.png',
                x: 13, y: 17.75,
                size: buttonSize,
                keyCode: "Numpad0"
            },
            select: {
                src: '/assets/images/ui/select.png',
                x: 11.5, y: 15.5,
                size: buttonSize,
                keyCode: "KeyF"
            },
            start: {
                src: '/assets/images/ui/start.png',
                x: 12.5, y: 15.5,
                size: buttonSize,
                keyCode: "KeyR"
            },
        }
        this.buttonObjects = [];

        this.init();
    }

    init() {
        Object.keys(this.buttons).forEach(b => {
            this.buttonObjects.push(new Button({
                src: this.buttons[b].src,
                x: this.buttons[b].x,
                y: this.buttons[b].y,
                size: this.buttons[b].size,
                keyCode: this.buttons[b].keyCode
            }))
        });
    }

    draw({ context }) {
        Object.keys(this.buttonObjects).forEach(key => {
            var x = this.buttonObjects[key].x + utils.withGrid(12);
            var y = this.buttonObjects[key].y + utils.withGrid(16);

            context.drawImage(
                this.buttonObjects[key].image,
                utils.withGrid(this.buttonObjects[key].x),
                utils.withGrid(this.buttonObjects[key].y),
                this.buttonObjects[key].size,
                this.buttonObjects[key].size
            )
        })
    }

    bindClick(canvas) {
        const rect = canvas.getBoundingClientRect()
        
            document.querySelector(".game-canvas").addEventListener("pointerdown", (e) => {
                const x = ((e.clientX - rect.left) / 16) / utils.getScalingFactor()
                const y = ((e.clientY - rect.top) / 16) / utils.getScalingFactor()

                Object.keys(this.buttonObjects).forEach(key => {
                    if (this.buttonObjects[key].containsPoint(x, y)) {
                        document.dispatchEvent(new KeyboardEvent("keydown", {
                            code: this.buttonObjects[key].keyCode
                        }));
                    }
                });

            });
            document.querySelector(".game-canvas").addEventListener("pointerup", (e) => {
                const x = ((e.clientX - rect.left) / 16) / utils.getScalingFactor()
                const y = ((e.clientY - rect.top) / 16) / utils.getScalingFactor()

                Object.keys(this.buttonObjects).forEach(key => {
                    if (this.buttonObjects[key].containsPoint(x, y)) {
                        document.dispatchEvent(new KeyboardEvent("keyup", {
                            code: this.buttonObjects[key].keyCode
                        }));
                    }
                });

            });
    }

}

class Button {
    constructor({ src, x, y, size, keyCode }) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.keyCode = keyCode;
        this.isActive = false;

        this.image = new Image();
        this.image.src = src;

        this.init();
    }

    init() {

    }

    containsPoint(x, y) {
        if (x < this.x - 0.2 || x > this.x + 1.2 || y < this.y - 0.2 || y > this.y + 1.2) {
            return false;
        }
        console.log(x, y)
        return true;
    }

}