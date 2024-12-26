var rootStyles = getComputedStyle(document.documentElement);

function getHSLColor(index) {
    const primaryColor = getPrimaryColor();
    const output = decrementLight(primaryColor, index*6);
    return output;
}

function getPrimaryColor() {
    return rootStyles.getPropertyValue('--primary-color').trim();
}

function getTextColor() {
    return rootStyles.getPropertyValue('--text-color').trim();
}

function setChartJs() {
    const textColor = getTextColor();
    Chart.defaults.color = textColor;
}

function decrementLight(hslColor, increment) {
    const regex = /hsl\((\d+), (\d+)%, (\d+)%\)/;
    const match = hslColor.match(regex);
    if (match) {
        let hue = parseInt(match[1]);
        let saturation = parseInt(match[2]);
        let lightness = parseInt(match[3]);

        lightness = Math.min(100, lightness - increment);

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    return hslColor;
}

setChartJs();