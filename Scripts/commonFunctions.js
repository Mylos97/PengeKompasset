var rootStyles = getComputedStyle(document.documentElement);

function getHSLColor(index=0) {
    const primaryColor = getPrimaryColor();
    const output = decrementLight(primaryColor, index*15);
    return output;
}

function getPrimaryColor() {
    return rootStyles.getPropertyValue('--primary-color').trim();
}

function getTextColor() {
    return rootStyles.getPropertyValue('--text-color').trim();
}

function getBlackColor() {
    return rootStyles.getPropertyValue('--black-color').trim();
}

function getChartColor() {
    return rootStyles.getPropertyValue('--background-chart-color').trim();
}

function setChartJs() {
    Chart.register(chartAreaBackground);

    const textColor = getTextColor();
    const blackColor = getBlackColor();
    Chart.defaults.color = textColor;
    Chart.defaults.plugins.legend.position = 'bottom';
    Chart.defaults.plugins.legend.onClick = undefined;
    Chart.defaults.plugins.legend.labels.boxWidth = 8;
    Chart.defaults.plugins.legend.labels.boxHeight = 8;
    Chart.defaults.plugins.tooltip.backgroundColor = 'white';
    Chart.defaults.plugins.tooltip.titleColor = blackColor;
    Chart.defaults.plugins.tooltip.bodyColor = blackColor;
    Chart.defaults.plugins.tooltip.padding = 8;
    Chart.defaults.plugins.tooltip.position = 'nearest';
    Chart.defaults.plugins.tooltip.cornerRadius = 3;
    Chart.defaults.plugins.tooltip.displayColors = false;
    Chart.defaults.elements.line.borderWidth = 2;

    Chart.defaults.plugins.chartAreaBackground = {
        color: getChartColor()
    };
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

const chartAreaBackground = {
  id: 'chartAreaBackground',
  beforeDraw(chart, args, options) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    const { left, top, width, height } = chartArea;

    ctx.save();
    ctx.fillStyle = options.color || 'red';
    ctx.fillRect(left, top, width, height);
    ctx.restore();
  }
};

setChartJs();