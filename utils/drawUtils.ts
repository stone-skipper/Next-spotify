function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(rgbString) {
  // Extract the integers from the rgb string
  const [r, g, b] = rgbString.match(/\d+/g).map(Number);

  // Convert each value to hexadecimal and pad with zero if necessary
  const toHex = (c) => c.toString(16).padStart(2, "0");

  // Concatenate the converted values into a hex color string
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function interpolateColor(color1, color2, factor = 0.5) {
  var rgb1 = hexToRgb(color1);
  var rgb2 = hexToRgb(color2);
  const interpolate = (start, end, factor) => (end - start) * factor + start;

  var result = {
    r: Math.round(interpolate(rgb1.r, rgb2.r, factor)),
    g: Math.round(interpolate(rgb1.g, rgb2.g, factor)),
    b: Math.round(interpolate(rgb1.b, rgb2.b, factor)),
  };
  return rgbToHex(`rgb(${result.r}, ${result.g}, ${result.b})`);
}

export function getRandomColorBetween(color1, color2) {
  const factor = Math.random();
  return interpolateColor(color1, color2, factor);
}

function getColorSpectrum(color1, color2, steps = 10) {
  let spectrum = [];
  for (let i = 0; i < steps; i++) {
    spectrum.push(interpolateColor(color1, color2, i / (steps - 1)));
  }
  return spectrum;
}
