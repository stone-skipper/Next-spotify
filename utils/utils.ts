export function hexToRGBA(hex, alpha) {
  // Remove the hash at the beginning if it's there
  hex = hex.replace(/^#/, "");

  // Parse the hex color string
  let r, g, b;

  if (hex.length === 3) {
    // If it is a three-digit hex code, each value is repeated to form the full value
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else if (hex.length === 6) {
    // If it is a six-digit hex code, parse each pair of digits
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else {
    return hex;
  }

  // Return the RGBA color string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function addZero(num) {
  if (num > 9) {
    return num;
  } else {
    return `0${num}`;
  }
}
