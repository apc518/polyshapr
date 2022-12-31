class Bounds {
    constructor(lower, upper){
        this.lower = lower;
        this.upper = upper;
    }

    size(){
        return this.upper - this.lower;
    }

    contains(n){
        return this.lower <= n && n <= this.upper;
    }
}


class Rhythm {
    static id_counter = 0;
    
    constructor(){
        this.id = Rhythm.id_counter;
        Rhythm.id_counter += 1;
    }

    /**
     * true if progress is within half of progressIncrement from the ideal progress value for the rhythm to hit, false otherwise
     */
    static isHitting(progress, progressIncrement, rhythm){
        debugLog("progress, increment, rhythm:", progress, progressIncrement, rhythm);

        if (rhythm <= 0) return false; // rhythm of 0 never hits

        let progressPerHit = 1 / rhythm;
        let floorMod = mod(progress, progressPerHit);
        let ceilMod = progressPerHit - mod(progress, progressPerHit);
        let distanceToIdeal = Math.min(floorMod, ceilMod);
        debugLog("distance to ideal:", distanceToIdeal);

        let distanceToIdealIsFromBelow = floorMod > ceilMod;

        let ideal = distanceToIdealIsFromBelow ? progress + distanceToIdeal : progress - distanceToIdeal;
        debugLog("ideal:", ideal);

        let lowerBound = ideal - progressIncrement / 2;
        let upperBound = ideal + progressIncrement / 2;
        debugLog(lowerBound, upperBound);

        return lowerBound < progress && progress <= upperBound;
    }
}


/**
 * position is relative to bounds, not absolute.
 * so if the bounds were 10, 30 and the position was 5, that would get drawn at 15.
 */
class PolyRhythm2d extends Rhythm{
    static required_keys = ["xRhythm", "yRhythm", "init_pos"];

    constructor({ xRhythm, yRhythm, init_pos }){
        super();

        let arg_keys_set = new Set(Object.keys(arguments[0]))

        // guard against not every required key being present in the
        // destructed argument object
        if (!PolyRhythm2d.required_keys.every(a => arg_keys_set.has(a)))
            throw new Error("Not all required keys present in PolyRhythm2d argument");

        // scalar numbers
        this.xRhythm = xRhythm;
        this.yRhythm = yRhythm;
        
        // position is a p5 Vector
        if (init_pos) {
            this.init_pos = Object.freeze(init_pos.copy());
        }
        else{
            this.init_pos = createVector(0, 0);
        }
        this.pos = this.init_pos.copy();
    }
}

class RectanglePolyRhythm2d extends PolyRhythm2d {
    constructor({ xRhythm, yRhythm, init_pos, size, xBounds, yBounds }){
        super({ xRhythm, yRhythm, init_pos });

        // Bounds objects, per Bounds class defined above
        this.xBounds = xBounds;
        this.yBounds = yBounds;

        this.size = size ? size : createVector(0, 0); // a p5 Vector
        
        //// non-argument fields
        this.children = [];

        this.colorIdx = 0;

        this.xSoundIdx = -1;
        this.ySoundIdx = -1;
    }

    setSoundIdx(n){
        this.soundIdx = n;
    }

    setColorIdx(n){
        this.colorIdx = n;
    }

    playIfOnBounds(){
        if(this.pos.x % this.xBounds.size() === 0){
            if (soundList.length > 0)
                soundList[(this.soundIdx) % soundList.length].on = true;
        }

        if(this.pos.y % this.yBounds.size() === 0){
            if (soundList.length > 0)
                soundList[(this.soundIdx + 1) % soundList.length].on = true;
        }

        this.children.forEach(p => p.playIfOnBounds());
    }


    calcPosition(progress){
        /**
         * so heres the idea:
         * 
         * compute a "master vector" that represents the whole path of this
         * polyrhythm through its entire cycle, only without regard for bouncing in bounds
         * 
         * we then scale that master vector according to the progress value
         * 
         * then use some modulus math to calculate where _inside_ the bounds
         * the position should be
         */
        
        let newXPos;
        let newYPos;

        
        let master_vector = createVector(
        this.xRhythm * this.xBounds.size(),
        this.yRhythm * this.yBounds.size()
        )
        
        let progressVector = master_vector.mult(progress);
        
        let unboundedPos = createVector(
            progressVector.x + this.init_pos.x,
            progressVector.y + this.init_pos.y,
        );
        
        let xMod = unboundedPos.x % this.xBounds.size();
        let yMod = unboundedPos.y % this.yBounds.size();

        if (this.xBounds.size() <= 0){
            newXPos = 0;
        }
        else{
            if (Math.round((unboundedPos.x - xMod) / this.xBounds.size()) % 2 === 0){
                newXPos = xMod;
            }
            else{
                newXPos = this.xBounds.size() - xMod;
            }
        }

        if (this.yBounds.size() <= 0){
            newYPos = 0;
        }
        else{
            if (Math.round((unboundedPos.y - yMod) / this.yBounds.size()) % 2 === 0){
                newYPos = yMod;
            }
            else{
                newYPos = this.yBounds.size() - yMod;
            }
        }

        return createVector(newXPos, newYPos);
    }

    /**
     * Set the position of this polyrhythm according to its
     * bounds, initial position, and rhythm, and parameter `progress`
     * which is a number from 0 to 1 indicating how far along in the
     * polyrhythm's cycle we are
     */
    setProgress(progress, progressIncrement){

        this.pos = this.calcPosition(progress);

        if (Rhythm.isHitting(progress, progressIncrement, this.xRhythm)) {
            onHit(this.xSoundIdx);
        }

        if (Rhythm.isHitting(progress, progressIncrement, this.yRhythm)) {
            onHit(this.ySoundIdx);
        }

        // update children
        this.children.forEach(p => p.setProgress(progress, progressIncrement));
    }

    drawBounds(){
        push()
        // resetMatrix()
        noFill()
        stroke(255, 0, 0)
        strokeWeight(2)
        rect(this.xBounds.lower, this.yBounds.lower, this.xBounds.size(), this.yBounds.size());

        this.children.forEach(p => p.drawBounds());

        pop()
    }

    draw(parent){
        push()

        if(parent){
            translate(
                parent.pos.x - parent.size.x / 2 + this.size.x / 2 + currentPatch.strokeWeight,
                parent.pos.y - parent.size.y / 2 + this.size.y / 2 + currentPatch.strokeWeight
            );
        }
        else{
            translate(this.xBounds.lower, this.yBounds.lower);
        }

        // draw our own self
        noFill();
        stroke(colorList[this.colorIdx % colorList.length]); // white wireframe square
        strokeWeight(currentPatch.strokeWeight);
        if(currentPatch.squareStyle === SQUARE_STYLES.SOLID){
            noStroke();
            fill(colorList[this.colorIdx % colorList.length]);
        }
        rect(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2, this.size.x, this.size.y); 

        // draw our children
        this.children.forEach(p => p.draw(this));
        
        pop();
    }
}


class EqTriangle{
    /**
     * pass in points, or a position and one of three size values
     * 
     * prior values take precedence if contradictions arise:
     * i.e. if you say the points are (0,0), (1,1), (1,0) and
     * the pos is (4,3), the triangle will be constructed based on the points
     * and the pos will be set to (2/3, 1/3)
     */
    constructor({ points, pos, sideLength, vertexRadius, sideRadius }){
        this.points = points;
        this.pos = pos;
        this.sideLength = sideLength;
        this.vertexRadius = vertexRadius;
        this.sideRadius = sideRadius;
        
        if (this.points){
            this.pos = createVector(
                (this.points[0] + this.points[2] + this.points[4]) / 3,
                (this.points[1] + this.points[3] + this.points[5]) / 3
            )
        }
    }
}


class EqTriangleRhythm2d extends Rhythm {

    static trianglePointsVertex(size, pointsDown=true, offset=createVector(0,0)){
        if(pointsDown){
            let v1 = createVector(0, size);
            let v2 = v1.copy().setHeading(7 * PI / 6);
            let v3 = v1.copy().setHeading(11 * PI / 6);
    
            return [offset.x + v2.x, offset.y + v2.y, offset.x + v1.x, offset.y + v1.y, offset.x + v3.x, offset.y + v3.y];
        }
        else{
            let v1 = createVector(0, -size);
            let v2 = v1.copy().setHeading(PI / 6);
            let v3 = v1.copy().setHeading(5 * PI / 6);

            return [offset.x + v1.x, offset.y + v1.y, offset.x + v3.x, offset.y + v3.y, offset.x + v2.x, offset.y + v2.y];
        }
    }

    static trianglePointsMidSide(size, pointsDown=true, offset){
        return EqTriangleRhythm2d.trianglePointsVertex(size * 2, pointsDown, offset);
    }

    /**
     * ypos is the y position of the base, whose dimensions are defined by xBounds
     */
    constructor({ rhythm, boundPos, boundSize, size }){
        super();

        this.rhythm = rhythm;
        this.boundPos = boundPos;
        this.boundSize = boundSize;
        this.size = size;

        this.boundPoints = EqTriangleRhythm2d.trianglePointsMidSide(this.boundSize + currentPatch.strokeWeight, true, this.boundPos);

        this.boundPt1 = createVector(...this.boundPoints.slice(0,2));
        this.boundPt2 = createVector(...this.boundPoints.slice(2,4));
        this.boundPt3 = createVector(...this.boundPoints.slice(4,6));

        this.pathPoints = EqTriangleRhythm2d.trianglePointsVertex(this.boundSize - this.size, false, this.boundPos);

        this.pathPt1 = createVector(...this.pathPoints.slice(0,2));
        this.pathPt2 = createVector(...this.pathPoints.slice(2,4));
        this.pathPt3 = createVector(...this.pathPoints.slice(4,6));

        this.children = [];
        this.soundIdx = -1;

        this.pos = this.pathPt1.copy();
        
        this.prevBounce = -1;
        this.onBounce = () => {};
        this.colorIdx = 0;
    }

    setColorIdx(n){
        this.colorIdx = n;
    }

    reset(){
        this.prevBounce = -1;
        this.children.forEach(c => c.reset());
    }

    setProgress(progress, progressIncrement){
        let innerProgress = (progress * this.rhythm / 3) % 1;


        if (innerProgress < 1/3){
            this.pos = this.pathPt1.copy().lerp(this.pathPt2, innerProgress * 3);
        }
        else if (innerProgress < 2/3){
            this.pos = this.pathPt2.copy().lerp(this.pathPt3, (innerProgress - 1/3) * 3);
        }
        else{
            this.pos = this.pathPt3.copy().lerp(this.pathPt1, (innerProgress - 2/3) * 3);
        }

        if (Rhythm.isHitting(progress, progressIncrement, this.rhythm)){
            onHit(this.soundIdx);
        }

        this.children.forEach(c => c.setProgress(progress, progressIncrement));
    }

    drawBounds(){
        push();
        noFill();
        stroke(255);
        strokeWeight(currentPatch.strokeWeight);
        triangle(this.boundPt1.x, this.boundPt1.y, this.boundPt2.x, this.boundPt2.y, this.boundPt3.x, this.boundPt3.y);
        pop();
    }

    drawPath(){
        push();
        noFill();
        stroke(255, 0, 255);
        strokeWeight(2);
        triangle(this.pathPt1.x, this.pathPt1.y, this.pathPt2.x, this.pathPt2.y, this.pathPt3.x, this.pathPt3.y);
        pop();
    }

    draw(parent){
        push();
        
        if(parent){
            translate(parent.pos.x - parent.boundPos.x, parent.pos.y - parent.boundPos.y + parent.size + parent.size * (parent.boundSize / parent.size - 2));
        }
        else{
            this.drawBounds();
        }

        noFill();
        stroke(colorList[this.colorIdx % colorList.length]);
        strokeWeight(currentPatch.strokeWeight);

        triangle(...EqTriangleRhythm2d.trianglePointsMidSide(this.size, true, this.pos));

        this.children.forEach(c => c.draw(this));

        pop();
    }
}

/**
 * if skips list is empty, assume all skips of 0
 */
class NGonRhythm2d extends Rhythm {
    static innermostPointAbsolute;
    static auxCanvas = document.createElement('canvas');
    static ctx = NGonRhythm2d.auxCanvas.getContext('2d');

    static drawInnerMostPoints = () => {
        NGonRhythm2d.ctx.beginPath();
        NGonRhythm2d.ctx.ellipse(NGonRhythm2d.innermostPointAbsolute.x, NGonRhythm2d.innermostPointAbsolute.y, 2, 2, 0, 0, Math.PI * 2);
        NGonRhythm2d.ctx.fillStyle = "#fff";
        NGonRhythm2d.ctx.fill();
        NGonRhythm2d.ctx.closePath();

        // image(NGonRhythm2d.auxCanvas, 0, 0);
    }

    constructor(polygon, skip=0){
        super();

        this.polygon = polygon;
        this.skip = skip;

        this.colorIdx = -1;

        this.children = [];
    }

    setColorIdx(n){
        this.colorIdx = n;
    }

    addChild(numSides, sizeFactor, skip=0){
        let child = new NGonRhythm2d(
            new Polygon(
                numSides,
                createVector(0, 0),
                sizeFactor * this.polygon.inSize - currentPatch.strokeWeight,
                0
            ),
            skip
        );

        this.children.push(child);

        return child;
    }

    setProgress(progress, progressIncrement){
        for(let child of this.children){
            // calculate the keyframes
            const lastStep = Math.floor(progress * this.polygon.n);
            const nextStep = Math.ceil(progress * this.polygon.n);
            
            const lastSide = lastStep * (child.skip + 1);
            const nextSide = nextStep * (child.skip + 1);
            
            const keyInnerRadiusVector = createVector(0, this.polygon.inSize - child.polygon.inSize - (currentPatch.strokeWeight));

            // because of the while loop below and no real guarantee that the polygon side counts arent 0
            // not taking chances on dividing by 0
            if (this.polygon.n < 1 || child.polygon.n < 1){
                throw new Error("polygon side count must be at least 1");
            }
            
            const lastSideKeyPos = keyInnerRadiusVector.copy().setHeading(2 * PI * lastSide / this.polygon.n - PI / 2);
            const nextSideKeyPos = keyInnerRadiusVector.copy().setHeading(2 * PI * nextSide / this.polygon.n - PI / 2);
            
            let da = ((child.skip + 1) * 2 * PI / this.polygon.n) - (2 * PI / child.polygon.n);

            // trim down da to within one nth of a full rotation since anything more would be more than enough (but keep the sign)
            while (Math.abs(da) > (2 * Math.PI / child.polygon.n)){
                if (da < 0){
                    da += 2 * Math.PI / child.polygon.n;
                }
                else{
                    da -= 2 * Math.PI / child.polygon.n;
                }
            }

            const lastSideKeyAngle = lastStep * da;
            const nextSideKeyAngle = nextStep * da;

            if (Rhythm.isHitting(progress, progressIncrement, this.polygon.n)){
                onHit(this.soundIdx);
            }

            // if the keyframes are the same then just take one and continue
            if (nextStep - lastStep === 0){
                child.polygon.pos = lastSideKeyPos;
                child.polygon.rotation = lastSideKeyAngle;

                continue;
            }

            // calculate the progress from last to next keyframe
            let innerProgress = (progress * this.polygon.n - lastStep) / (nextStep - lastStep);

            // set position and rotation by lerping between keyframes
            child.polygon.pos = createVector(
                lerp(lastSideKeyPos.x, nextSideKeyPos.x, innerProgress),
                lerp(lastSideKeyPos.y, nextSideKeyPos.y, innerProgress)
            )

            child.polygon.rotation = lerp(lastSideKeyAngle, nextSideKeyAngle, innerProgress);

        }

        this.children.forEach(c => c.setProgress(progress, progressIncrement));
    }

    draw(){
        push();
        
        translate(this.polygon.pos);
        rotate(this.polygon.rotation);
        
        noFill();
        
        // draw center point
        strokeWeight(10);
        stroke("#0ff");
        // ellipse(0, 0, 1);
        
        stroke(colorList[this.colorIdx % colorList.length]);
        strokeWeight(currentPatch.strokeWeight);
        if(this.children.length === 0) strokeWeight(currentPatch.strokeWeight)

        beginShape();
        
        stroke(colorList[this.colorIdx % colorList.length]); // rest of them

        let numVerticesToDraw = this.polygon.vertices.length + (currentPatch.strokeWeight > 2 ? 2 : 1);

        for(let i = 0; i < numVerticesToDraw; i++){
            let idx = (i+1) % this.polygon.vertices.length;
            vertex(this.polygon.vertices[idx].x, this.polygon.vertices[idx].y);
            
            // draw a dot on a specific vertex. This aids in seeing the rotation for large polygons
            // if(i === this.polygon.vertices.length){
            //     fill(255);
            //     ellipse(this.polygon.vertices[idx].x, this.polygon.vertices[idx].y, 10);
            //     noFill();
            // }
        }

        endShape();

        for(let child of this.children){
            child.draw();
        }

        let absTranslation = getAbsoluteTranslation();

        if (this.children.length === 0){
            NGonRhythm2d.innermostPointAbsolute = absTranslation;
        }

        pop();
    }

    reset(){
        this.children.forEach(c => c.lastAbsSide = -1);
    }
}


class Polygon{
    /**
     * pos should be a p5 Vector, inSize being the radius of the inscribed circle
     */
    constructor(numSides, pos, inSize, rotation=0){
        if (numSides < 1){
            throw new RangeError("numSides must be at least 1");
        }

        this.n = numSides;
        this.pos = pos;
        this.inSize = inSize;
        this.rotation = rotation;

        // calculate radius of circumscribed circle
        this.outSize = this.inSize / Math.cos(PI / this.n);

        // populate vertices
        this.vertices = [];
        let vertexVector = createVector(0, this.outSize);
        for(let i = 0; i < this.n; i++){
            vertexVector.setHeading((2 * PI * i / this.n) - (PI / this.n) - PI / 2);
            this.vertices.push(vertexVector.copy());
        }

        this.interiorAngle = (this.n - 2) * PI / this.n;
    }


    /**
     * calculate the radius of the inscribed circle for a polygon with `numSides` sides and exscribed circle radius of `outSize`
     */
    static calcInSize(numSides, outSize){
        if (numSides < 1){
            throw new RangeError("number of sides must be at least 1");
        }
        return outSize * Math.cos(PI / numSides);
    }
    
    /**
     * returns the ratio of inner radius such that a regular polygon with
     * childSideCount sides will have the same side length as parentSideCount,
     * or the inverse if the inverse is smaller, to avoid shapes with higher side
     * counts inside of lower side counts being too big
     */
    static innerRadiusRatioForSameSideLength(parentSideCount, childSideCount){
        if (parentSideCount < 1) throw new RangeError("parentSideCount must be at least 1");
        if (childSideCount < 1) throw new RangeError("childSideCount must be at least 1");

        let sideLengthOfUnitParent = 2 * Math.tan(Math.PI / parentSideCount);
        let ratio = sideLengthOfUnitParent / (2 * Math.tan(Math.PI / childSideCount));

        return Math.min(ratio, Math.sqrt(1/ratio));
    }
}
