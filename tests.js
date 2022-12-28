const consoleErrorStyle = "color: red; font-weight: bold;"
const consoleGoodStyle = "color: green; font-weight: bold;"

let test_pr = null;

const myTests = [
    {
        name: "PositionTest1",
        desc: "Test that position is calculated correctly",
        func: () => {
            test_pr.setProgress(0.5);
            return test_pr.pos.x === 50 && test_pr.pos.y === 0;
        }
    },
    {
        name: "PositionTest2",
        desc: "Test that position is calculated correctly",
        func: () => {
            test_pr.setProgress(0.4);
            return test_pr.pos.x === 80 && test_pr.pos.y === 40;
        }
    },
    {
        name: "PositionTest3",
        desc: "Test that position is calculated correctly",
        func: () => {
            test_pr.setProgress(0.9);
            return test_pr.pos.x === 70 && test_pr.pos.y === 40;
        }
    },
    {
        name: "PositionTest4",
        desc: "Test that position is calculated correctly",
        func: () => {
            let pr2 = new RectanglePolyRhythm2d({
                xRhythm: 2,
                yRhythm: 3,
                init_pos: createVector(10, 10),
                xBounds: new Bounds(10, 90),
                yBounds: new Bounds(10, 90),
            })

            pr2.setProgress(0);
            return pr2.pos.x === 10 && pr2.pos.y === 10;
        }
    },
    {
        name: "PatchValidationTest1",
        desc: "Test that the Patch class validates rhythm lists correctly",
        func: () => {
            let lst = [0,1,2,3,4,5,6,7,8];
            return Patch.rhythmListIsValid(lst);
        }
    },
    {
        name: "PatchValidationTest2",
        desc: "Test that the Patch class validates rhythm lists correctly",
        func: () => {
            let lst = [-1,0,1,2,3,4,5,6,7,8];
            return !Patch.rhythmListIsValid(lst);
        }
    }
]

function runTests(){
    test_pr = new RectanglePolyRhythm2d({
        xRhythm: 3,
        yRhythm: 4,
        init_pos: createVector(0, 0),
        size: createVector(10, 10),
        xBounds: new Bounds(0, 100),
        yBounds: new Bounds(0, 100),
    })

    for(let t of myTests){
        // I know, "'== true' bad!" but heres the issue: javascript type coercion.
        // I need to know that t.func() actually returned a boolean true value, not just any old truthy value (of which there are many...)
        if (t.func() === true)
            console.log(`${t.name}: %cPASSED`, consoleGoodStyle);
        else
            console.log(`${t.name}: %cFAILED`, consoleErrorStyle, `\nDescription: ${t.desc}`);
    }
}
