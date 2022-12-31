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


// sieve of eratosthenes for prime numbers, code from https://stackoverflow.com/a/64054888/13010844
function eratosthenes (max) {
    let sqrt = Math.sqrt(max)
    let sieve = new Array(max).fill(0)
  
    for (let primeCandidate = 2; primeCandidate < sqrt; primeCandidate++) {
      if (sieve[primeCandidate] === true) {
        continue // already processed
      }
      for (let multiple = primeCandidate * primeCandidate; multiple < max; multiple += primeCandidate) {
        if (sieve[multiple] === 0) {
          sieve[multiple] = true
        }
      }
    }
  
    return sieve
      .map((isPrime, i) => ({ i, isPrime })) // find the number associated with the index
      .filter(({ i, isPrime }) => isPrime === 0 && i >= 2) // remove not prime numbers
      .map(({ i }) => i) // output only the values
}