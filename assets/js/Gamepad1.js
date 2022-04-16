class GamePad {
    constructor() {
        if (typeof screen.orientation === 'undefined') {
            var buttons = document.querySelector(".buttons");
            buttons.innerHTML = (`
        <div class="ab_btns">
            <div>
                <p>&nbsp;</p>
                <button class="controls" id="b"><img class="ctrl-img" src="/assets/images/ui/B.png"/></button>
            </div>
            <div>
                <button class="controls" id="a"><img class="ctrl-img" src="/assets/images/ui/A.png"/></button>
                <p>&nbsp;</p>
            </div>
        </div>
        <div class="mvmt_buttons">
            <button class="controls" id="left"><img class="ctrl-img" src="/assets/images/ui/left.png"/></button>
            <div class="updown">
                <button class="controls" id="up"><img class="ctrl-img" src="/assets/images/ui/up.png"/></button>
                <br/>
                <button class="controls" id="down"><img class="ctrl-img" src="/assets/images/ui/down.png"/></button>
            </div>
            <button class="controls" id="right"><img class="ctrl-img" src="/assets/images/ui/right.png"/></button>
        </div>
        `)

            document.querySelector("#a").addEventListener("click", () => {
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    code: 'KeyE'
                }))
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    code: 'KeyE'
                }))
            });
            document.querySelector("#b").addEventListener("click", () => {
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    code: 'KeyQ'
                }))
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    code: 'KeyQ'
                }))
            })

            document.querySelector("#up").addEventListener("touchstart", () => {
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    code: 'ArrowUp'
                }))
            })
            document.querySelector("#up").addEventListener("touchend", () => {
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    code: 'ArrowUp'
                }))
            })

            document.querySelector("#down").addEventListener("touchstart", () => {
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    code: 'ArrowDown'
                }))
            })
            document.querySelector("#down").addEventListener("touchend", () => {
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    code: 'ArrowDown'
                }))
            })

            document.querySelector("#left").addEventListener("touchstart", () => {
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    code: 'ArrowLeft'
                }))
            })
            document.querySelector("#left").addEventListener("touchend", () => {
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    code: 'ArrowLeft'
                }))
            })

            document.querySelector("#right").addEventListener("touchstart", () => {
                document.dispatchEvent(new KeyboardEvent("keydown", {
                    code: 'ArrowRight'
                }))
            })
            document.querySelector("#right").addEventListener("touchend", () => {
                document.dispatchEvent(new KeyboardEvent("keyup", {
                    code: 'ArrowRight'
                }))
            })

        }
    }
}