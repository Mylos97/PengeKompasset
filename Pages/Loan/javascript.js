var interestRateInput = document.querySelector("#total-interest");
var monthlyPaymentInput = document.querySelector("#monthly-payment");
var totalAmount = document.querySelector("#total-loaned").getAttribute('value');
var interestRate = interestRateInput.value;
var monthlyPayment = monthlyPaymentInput.value;
var interestPayment = 3;
var months = 12 * 30;
var loanChart;
var interestChart;

function totalLoanAmountChanged(e) {
    totalAmount = parseInt(e.detail.value)
    drawCharts();
}

function interestRateChanged() {
    interestRate = (interestRateInput.value);
    drawCharts();
}

function loanYearsChanged() {
    loanYears = loanYearsInput.value;
    drawCharts();
}

function monthlyPaymentChanged() {
    monthlyPayment = monthlyPaymentInput.value;
    drawCharts();
}

function findLoanLabels(datasets) {
    const labels = [];

    datasets[0].data.forEach((_, i) => {
        labels.push(`Måned ${i + 1}`)
    });
    return labels;
}

function findInterestLabels(datasets) {
    const labels = [];
    datasets.forEach(dataset => {
        labels.push(dataset.label);
    });
    return labels;
}

function createDatasetLoan(monthlyPayment, index) {
    const color = getHSLColor(index);
    const datasetLoan = {
        label: `Månedlig betaling: ${monthlyPayment}`,
        data: [],
        pointRadius: 1,
        borderColor: color,
        backgroundColor: color,
        pointStyle: false
    };
    return datasetLoan;
}

function createDatasetInterest(monthlyPayment) {
    const datasetInterest = {
        label: `Rente betalt med månedlig betalign: ${monthlyPayment}`,
        data: [],
    };
    return datasetInterest;
}

function getMonthlyPayments() {
    const monthlyPayments = []
    var currentMonthlyPayment = parseInt(monthlyPayment);
    for (let i = 0; i < 3; i++) {
        monthlyPayments.push(currentMonthlyPayment);
        currentMonthlyPayment += 1000;
    }

    return monthlyPayments;
}

function calculateDataforDataset(inMonthlyPayment, datasetLoan) {
    let currentMoney = totalAmount;
    let runningInterest = 0;
    let quarterInterest = 0;
    let interestForCalculation = (interestRate * 0.01)/12
    let months = 1;

    for (let i = 0; i < months; i++) {
        currentMoney -= inMonthlyPayment;

        quarterInterest += Math.round(currentMoney * interestForCalculation)
        if (i % 3 === 0) {
            currentMoney += quarterInterest;
            runningInterest += quarterInterest;
            quarterInterest = 0
        }
        
        datasetLoan.data.push(Math.ceil(currentMoney));

        if (currentMoney <= 0) {
            break;
        }
        months++;
    }

    return [datasetLoan, Math.floor(runningInterest), months];
}

function calculateRentData() {
    const monthlyPayments = getMonthlyPayments();
    const datasetsLoan = [];
    const datasetsInterest = [];
    monthlyPayments.forEach((payment, i) => {
        const currentDatasetLoan = createDatasetLoan(payment, i);
        const currentInterest = createDatasetInterest(payment);
        const [loanData, cost, months] = calculateDataforDataset(payment, currentDatasetLoan, currentInterest);
        datasetsLoan.push(loanData);
        datasetsInterest.push({ payment, cost, months});
    });
    const output = [datasetsLoan, datasetsInterest];
    return output;
}

function drawLoanChart(datasets, labels) {
    if (loanChart) {
        loanChart.destroy();
    }
    const loanId = document.getElementById('loan-chart');

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
    }

    loanChart = new Chart(loanId, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: options
    });
}

function drawCharts() {
    const datasets = calculateRentData();
    const loanData = datasets[0];
    const loanLabels = findLoanLabels(loanData);
    const interestData = datasets[1];
    drawLoanChart(loanData, loanLabels);
    makeInterestList(interestData);
}

function makeInterestList(interestData) {
    const list = document.querySelector("#loan-list").querySelector("ul");
    list.innerHTML = "";
    interestData.forEach(data => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        const text = `Månedlig betaling med ${data.payment} kr. ender med at koste ${data.cost} i renter  og det tager ${data.months} måneder at betale tilbage`
        p.appendChild(document.createTextNode(text));
        li.appendChild(p);
        list.appendChild(li);
    });
    
}
interestRateChanged();