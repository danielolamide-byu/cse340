
function quad(a, b, c) {
    const pos = ((-b) + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / 2 * a
    const neg = ((-b) - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / 2 * a
    const result = console.log(`x = ${pos}, x = ${neg}`);
    return result;
};

quad(1, -3, -4);