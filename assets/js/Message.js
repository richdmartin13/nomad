class Message {
    constructor (config) {
        this.who = config.who.toUpperCase();
        this.text = config.text;
        this.onComplete = config.onComplete;
        this.element = null;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Message");
        this.element.innerHTML = (`
        <p class="Message_p">${this.who}: ${this.text}</p>
        <button class="Message_button">Next</button>
        `)
        
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
        this.element.remove();
        this.onComplete();
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}