(function () {
    const world = new World({
        element: document.querySelector(".game-container")
    });

    document.querySelector('body').addEventListener('wheel', preventScroll, { passive: false });

    function preventScroll(e) {
        e.preventDefault();
        e.stopPropagation();

        return false;
    }

    world.init();
})();