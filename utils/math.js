// real mod, not javascripts default "remainder" operator %
const mod = (n, m) => (n % m + m) % m;

// reshape 0-1 values to look like a logistic curve, with 0 and 1 mapping to themselves
function unitTanh(v){
    if (v < 0) throw Error("value must be non-negative");

    let frac = v % 1;

    if (Math.floor(v) % 2 == 1){
        v = 1 - v % 1;
    }
    else{
        v = v % 1;
    }

    return 0.5 + Math.tanh(4 * v - 2) / (-2 * Math.tanh(-2));
}