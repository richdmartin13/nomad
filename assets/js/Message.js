class Message {
    constructor (config) {
        this.who = config.who != null ? `${config.who.toUpperCase()}: ` : '';
        this.text = config.text;
        this.onComplete = config.onComplete;
        this.element = null;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Message");
        this.element.innerHTML = (`
        <p class="Message_p">${this.who}</p>
        <button class="Message_button">&nbsp;</button>
        `)

        this.revealingText = new RevealingText({
            element: this.element.querySelector(".Message_p"),
            text: this.text,
        })
        
        this.element.querySelector(".Message_button").addEventListener("click", () => {
            this.done();
        });

        this.actionListener = new KeyPressListener("Enter", () => {
            this.done();
        });

        this.actionListener = new KeyPressListener("KeyE", () => {
            this.done();
        });
    }

    done() {
        if(this.revealingText.isDone) {
            this.element.remove();
            this.actionListener.unbind();
            this.onComplete();
        } else {
            this.revealingText.warpToDone();
        }
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
        this.revealingText.init();
    }
}