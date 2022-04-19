class Menu {
    constructor({debug}) {
        this.background = new Image();
        this.background.src = '/assets/images/ui/menu.png';
        this.button = new Image();
        this.button.src = '/assets/images/ui/button.png';
        this.options = {
            refresh: {
                name: "Regenerate",
                action: () => { location.reload() },
                x: utils.withGrid(10.5),
                y: utils.withGrid(7)
            },
            debug: {
                name: "Debug Mode",
                action: debug,
                x: utils.withGrid(10.5),
                y: utils.withGrid(8)
            }
        }
    }

    draw({context, hero}) {
        context.drawImage(
            this.background,
            utils.withGrid(9.5), utils.withGrid(6),
            96, 112
        )

        Object.values(this.options).forEach(object => {
            var x = object.x;
            var y = object.y;

            context.drawImage(this.button, x, y);

            context.font = '10px sans-serif';
            context.fillStyle='#FFF';
            context.fillText(object.name, x + 3, y+11);
        })
        
    }
}