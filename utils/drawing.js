function getAbsoluteTranslation(){
    let matrix = drawingContext.getTransform();
    let x_0 = matrix['e'];
    let y_0 = matrix['f'];
    let x_1 = matrix['a'] + matrix['e'];
    let y_1 = matrix['b'] + matrix['f'];
    let media_per_unit = dist(x_0, y_0, x_1, y_1);
    return createVector(x_0 / media_per_unit, y_0 / media_per_unit);
}
