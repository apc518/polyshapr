function squarePolyRhythmRecursive(){
    let rhythmList = currentPatch.rhythms.slice();

    // if there are an odd number of rhythms we fill in the missing 0
    if (rhythmList.length % 2 !== 0){
        rhythmList.push(0);
    }

    let parentSize = currentPatch.sizeMultiplier * canvasWidth;
    let padding = (parentSize + currentPatch.strokeWeight) / (1 + rhythmList.length / 2);

    return _squarePolyRhythmRecursive(parentSize, rhythmList, padding, 0);
}

function _squarePolyRhythmRecursive(parentSize, rhythmList, padding, depth=0){
    // base cases
    const thisSize = parentSize - padding;
    if (thisSize <= 0) return null;

    let pr = new RectanglePolyRhythm2d({
        xRhythm: rhythmList[(2 * depth) % rhythmList.length],
        yRhythm: rhythmList[(2 * depth + 1) % rhythmList.length],
        init_pos: createVector(0, 0),
        size: createVector(thisSize, thisSize),
        xBounds: new Bounds(thisSize / 2 + currentPatch.strokeWeight, parentSize - thisSize / 2 - currentPatch.strokeWeight),
        yBounds: new Bounds(thisSize / 2 + currentPatch.strokeWeight, parentSize - thisSize / 2 - currentPatch.strokeWeight)
    });

    pr.setColorIdx(depth);

    pr.xSoundIdx = 2 * depth;
    pr.ySoundIdx = 2 * depth + 1;

    let child = _squarePolyRhythmRecursive(thisSize, rhythmList, padding, depth + 1);

    if(child){
        pr.children.push(child);
    }

    return pr;
}


function trianglePolyrhythmRecursive(){
    let rhythmList = currentPatch.rhythms;

    if (rhythmList.length < 1) throw new Error("rhythm list must have at least one element");

    let parentSize = currentPatch.sizeMultiplier * canvasWidth / 4;
    let padding = parentSize / (rhythmList.length + 1) - currentPatch.strokeWeight;

    return _trianglePolyrhythmRecursive(parentSize, rhythmList, padding, 0);
}

function _trianglePolyrhythmRecursive(parentSize, rhythmList, padding, depth=0, parent=null){
    const thisSize = parentSize - padding;
    if (depth >= rhythmList.length) return null;

    let pr = new EqTriangleRhythm2d({
        rhythm: rhythmList[depth % rhythmList.length],
        boundPos: createVector(canvasWidth / 2, parent ? parent.pos.y : canvasHeight / 2 - 100),
        boundSize: parentSize,
        size: thisSize
    });

    pr.setColorIdx(depth);
    pr.soundIdx = depth;

    let child = _trianglePolyrhythmRecursive(thisSize - currentPatch.strokeWeight, rhythmList, padding, depth + 1, pr);

    if(child){
        pr.children.push(child);
    }

    return pr;
}


function nGonPolyrhythmRecursive(){
    let sideNums = currentPatch.rhythms.filter(n => n >= 1);

    // add a 0 to the front of the skips list because the first shape doesnt actually move
    let skips = currentPatch.skips.slice();
    skips.unshift(0);

    if(sideNums.length === 0) throw new Error("sideNums must contain at least 1 item");
    if(skips.length < sideNums.length) throw new Error("skips list must be at least as long as rhythms list");

    let firstRhythmUnitPolygon = new Polygon(sideNums[0], createVector(0,0), 1);
    let firstAncestorInnerRadius = currentPatch.sizeMultiplier * (canvasWidth / (2 * firstRhythmUnitPolygon.outSize) - currentPatch.strokeWeight - 5);

    let pr = new NGonRhythm2d(
        new Polygon(sideNums[0] , createVector(canvasWidth / 2, canvasHeight / 2), firstAncestorInnerRadius, 0),
        skips[0]
    );

    pr.setColorIdx(0);

    // add one extra shape to the end so that the last rhythm in the input actually has a child
    // so it gets played (the child of a given polygon is what actually triggers the playing of that polygon's rhythm)
    sideNumsAugmented = sideNums.slice();
    sideNumsAugmented.push(currentPatch.ngonInnerPolygonSideCount);

    _nGonPolyrhythmRecursive(sideNumsAugmented, skips, pr, 1);

    return pr;
}


function _nGonPolyrhythmRecursive(sideNums, skips, parent, depth){
    if (depth >= sideNums.length) return;
    
    parent.soundIdx = depth - 1;
    
    let child = parent.addChild(sideNums[depth], currentPatch.ngonShrinkFactor * Polygon.innerRadiusRatioForSameSideLength(sideNums[depth-1], sideNums[depth]), skips[depth]);
    
    child.setColorIdx(depth);
    
    _nGonPolyrhythmRecursive(sideNums, skips, parent.children[0], depth + 1);
}
