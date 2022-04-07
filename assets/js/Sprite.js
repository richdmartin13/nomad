class Sprite {
    constructor(config) {

        //set up the image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        this.shadow = new Image();
        this.useShadow = config.useShadow || false;
        if(this.useShadow)
            this.shadow.src = "/assets/images/characters/shadow.png";
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }

        this.badge = new Image();
        this.useBadge = config.useBadge || false;
        if(this.useBadge)
            this.badge.src = "/assets/images/characters/badge.png";
        this.badge.onload = () => {
            this.isBadgeLoaded = true;
        }

        //configuring initial state animation
        this.animations = config.animations || {
            "idle-down": [ [0,0] ],
            "idle-right": [ [0,1] ],
            "idle-up": [ [0,2] ],
            "idle-left": [ [0,3] ],
            "walk-down": [ [1,0], [0,0], [3,0], [0,0] ],
            "walk-right": [ [1,1], [0,1], [3,1], [0,1] ],
            "walk-up": [ [1,2], [0,2], [3,2], [0,2] ],
            "walk-left": [ [1,3], [0,3], [3,3], [0,3] ],
        }
        this.currentAnimation = config.currentAnimation || "idle-down";
        this.currentFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 8;
        this.animationFrameProgress = this.animationFrameLimit;


        //reference game object
        this.gameObject = config.gameObject;
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentFrame];
    }

    setAnimation(key) {
        if(this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        //Downtick frame progress
        if(this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        //Reset
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentFrame += 1;
        if(this.frame === undefined) {
            this.currentFrame = 0;
        }
        
    }

    draw(context, cameraMan) {
        const x = this.gameObject.posX - 8 + utils.withGrid(10.5) - cameraMan.posX;
        const y = this.gameObject.posY - 18 + utils.withGrid(8) - cameraMan.posY;

        this.isBadgeLoaded && context.drawImage( this.badge, x, y - 8)
        this.isShadowLoaded && context.drawImage( this.shadow, x, y);
        
        const [frameX, frameY] = this.frame;
        
        this.isLoaded && context.drawImage(
            this.image,
            frameX * 32, frameY * 32,
            32,32,
            x, y,
            32, 32
        );
        this.updateAnimationProgress();
    }
}