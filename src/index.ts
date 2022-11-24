import {
    Application,
    Container,
    Graphics
} from 'pixi.js'

interface Position {
    x: number;
    y: number;
}


const container = document.getElementById("pixi-content");
let annoRef: Container | null = null;
let sprite: Graphics | null = null;
let initPointer: Position | null = null;
let isMouseButtonDown = false;

const getMousePos = (event: MouseEvent) => {
    const pos = {
        x: 0,
        y: 0
    };
    if (container) {
        // Get the position and size of the component on the page.
        const holderOffset = container.getBoundingClientRect();
        pos.x = event.pageX - holderOffset.x;
        pos.y = event.pageY - holderOffset.y;
    }
    return pos;
};

const onMouseMove = (e: MouseEvent) => {
    if (!isMouseButtonDown) {
        return;
    }

    // clearSpriteRef(annoRef)
    if (initPointer == null) return;

    if (!sprite) return;

    sprite.clear();
    sprite.lineStyle(2, 0xff0000, 1);
    sprite.moveTo(initPointer.x, initPointer.y);

    const mousePosRef = getMousePos(e);
    sprite.lineTo(mousePosRef.x, mousePosRef.y);
};

const onMouseDown = (e: MouseEvent) => {
    const mousePosRef = getMousePos(e);
    initPointer = mousePosRef;

    sprite = new Graphics();
    sprite.lineStyle(2, 0xff0000, 1);
    sprite.moveTo(initPointer.x, initPointer.y);
    sprite.lineTo(mousePosRef.x, mousePosRef.y);

    annoRef?.addChild(sprite);

    isMouseButtonDown = true;
};

const onMouseUp = (_e: MouseEvent) => {
    isMouseButtonDown = false;
};

function initGraphics() {
    if (!container) return;

    const app = new Application({
        resolution: window.devicePixelRatio || 1,
        antialias: true,
        resizeTo: window,
    });
    annoRef = new Container();
    app.stage.addChild(annoRef);
    container.appendChild(app.view);

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseup", onMouseUp);
}

initGraphics();
