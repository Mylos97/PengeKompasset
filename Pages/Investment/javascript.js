var savingsInput = document.querySelector("#saving-each-month");
var savings = savingsInput.value;
var marketRaiseInput = document.querySelector("#market-raise"); 
var marketRaise = marketRaiseInput.value;
var yearInput = document.querySelector("#years");
var year = yearInput.value;
var chartInvestment;

function marketRaiseIncreased() {
    marketRaise = parseInt(marketRaiseInput.value) * 0.01;
    drawChart();
}

function savingsChanged() {
    savings = parseInt(savingsInput.value);
    drawChart();
}

function yearChanged() {
    year = yearInput.value;
    drawChart();
}

function drawChart() {
    const {labels, datasets} = calculateData();
    
    if (chartInvestment) {
        chartInvestment.destroy();
    };

    const chart = document.getElementById('savings-chart');

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                min: 0,
            },
            x: {
                ticks: {
                    callback: getYearLabel
                },
                grid: {
                    color:'rgba(0,0,0,0.0)'
                }
            }
        }
    };

    chartInvestment = new Chart(chart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: options
    });
}

function calculateData() {
    const color = getHSLColor();
    const color2 = getHSLColor(2);
    const labels = [];
    const dataset = {
        label: `Opsparing`,
        data: [],
        borderColor: color,
        backgroundColor: color,
        pointStyle: false
    };

    const datasetUden = {
        label: `Opsparing uden investering`,
        data: [],
        borderColor: color2,
        backgroundColor: color2,
        pointStyle: false
    };

    var current = parseInt(savings);
    var currentNoGrowth = parseInt(savings)
    var incrementTick = 3;
    var growthRate = 1.00 + (marketRaise/incrementTick);
    var yearLoop = parseInt(year); 
    
    for (let i = 0; i < 12 * yearLoop + 1; i++) {
        dataset.data.push(current);
        datasetUden.data.push(currentNoGrowth);

        if (i % incrementTick === 0 && i !== 0) {
            current = Math.floor(current * growthRate);
        }
        currentNoGrowth += parseInt(savings);
        current += parseInt(savings);
        labels.push(`Måned ${i}`);
    }
    

    return {labels: labels, datasets: [dataset, datasetUden]};
}

marketRaiseIncreased();