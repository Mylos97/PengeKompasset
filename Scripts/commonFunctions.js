var rootStyles = getComputedStyle(document.documentElement);

function getHSLColor(index=0) {
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
    Chart.defaults.plugins.legend.position = 'bottom';
    Chart.defaults.plugins.legend.onClick = undefined;
    Chart.defaults.plugins.legend.labels.boxWidth = 4;
    Chart.defaults.plugins.legend.labels.boxHeight = 1;
}

function getYearLabel(_, index, _) {
    const year = Math.floor(index/12);
    if(year === 0) return '';
    if(index % 12 !== 0) return '';
    return `År ${year}`
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