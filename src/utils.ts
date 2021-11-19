export function toInternalTime(value: number, units: string) {
  switch (units) {
    case "hours":
      return value * 60 * 60;
    case "days":
      return value * 24 * 60 * 60;
    case "weeks":
      return value * 7 * 24 * 60 * 60;
  }

  return NaN
}

export function fromInternalTime(value: number, units: string) {
  switch (units) {
    case "hours":
      return value / (60 * 60);
    case "days":
      return value / (24 * 60 * 60);
    case "weeks":
      return value / (7 * 24 * 60 * 60);
  }

  return NaN
}

export function convertDose(dose: number, interval: number, doseType: string) {
  switch (doseType) {
    case "per_dose":
      return dose;
    case "per_hour":
      return dose * (interval / toInternalTime(1, "hours"));
    case "per_day":
      return dose * (interval / toInternalTime(1, "days"));
    case "per_week":
      return dose * (interval / toInternalTime(1, "weeks"));
  }

  return NaN
}

export function newtonRaphson(f: (x: number) => number, fp: (x: number) => number, guess: number, xmin: number, xmax: number, threshold: number) {
  let y;

  do {
    y = f(guess);
    guess = guess - y / fp(guess);

    if (guess < xmin) {
      guess = xmin;
    } else if (guess > xmax) {
      guess = xmax;
    }
  } while (Math.abs(y) > threshold);

  return guess;
}

export function f_Ke(tHalf: number) {
  return Math.log(2) / tHalf;
}

// these are indeterminate form when Ka = Ke, but have a limit
export function f_tMax(Ka: number, Ke: number) {
  return Ka !== Ke ? Math.log(Ka / Ke) / (Ka - Ke) : 1 / Ka;
}

export function f_tMax_prime(Ka: number, Ke: number) {
  return Ka !== Ke
    ? (Ka * -Math.log(Ka / Ke) + Ka - Ke) / (Ka * Math.pow(Ka - Ke, 2))
    : -1 / (2 * Math.pow(Ka, 2));
}
