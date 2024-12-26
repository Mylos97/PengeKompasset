var totalAmountInput = document.querySelector("#total-loan");
var interestRateInput = document.querySelector("#total-interest");
var loanYearsInput = document.querySelector("#loan-years");
var monthlyPaymentInput = document.querySelector("#monthly-payment");
var totalAmount = totalAmountInput.value;
var interestRate;
var loanYears = loanYearsInput.value;
var monthlyPayment = monthlyPaymentInput.value;
var interestPayment = 3;
var months = 12 * loanYears;
var loanChart;
var interestChart;

function totalLoanAmountChanged() {
    totalAmount = totalAmountInput.value;
    drawCharts();
}

function interestRateChanged() {
    interestRate = (interestRateInput.value * 0.01) / 4;
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

    datasets[0].data.forEach((element, i) => {
        labels.push(`Month${i + 1}`)
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
        backgroundColor: color
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
    for (let i = 0; i < 4; i++) {
        monthlyPayments.push(currentMonthlyPayment);
        currentMonthlyPayment += 1000;
    }

    return monthlyPayments;
}

function calculateDataforDataset(inMonthlyPayment, datasetLoan, datasetInterest) {
    let currentMoney = totalAmount;
    let runningInterest = 0;

    for (let i = 0; i < months; i++) {
        if (i % 3 === 0 && i !== 0) {
            const interestMoney = (currentMoney * interestRate);
            currentMoney += interestMoney;
            runningInterest += interestMoney;
        }
        currentMoney -= inMonthlyPayment;

        datasetLoan.data.push(currentMoney);

        if (currentMoney <= 0) {
            break;
        }
    }

    datasetInterest.data.push(Math.floor(runningInterest));
    return [datasetLoan, datasetInterest];
}

function calculateRentData() {
    const monthlyPayments = getMonthlyPayments();
    const datasetsLoan = [];
    const datasetsInterest = [];
    monthlyPayments.forEach((payment, i) => {
        const currentDatasetLoan = createDatasetLoan(payment, i);
        const currentInterest = createDatasetInterest(payment);
        const output = calculateDataforDataset(payment, currentDatasetLoan, currentInterest);
        const loanData = output[0];
        const interestData = output[1];
        datasetsLoan.push(loanData);
        datasetsInterest.push(interestData);
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
                    callback: function (value, index, values) {
                        const year = Math.floor(index/12);
                        if(year === 0) return '';
                        if(index % 12 !== 0) return '';
                        return `År ${year}`
                    }
                },
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
    const loanData = datasets[0]
    const interestData = datasets[1];
    const loanLabels = findLoanLabels(loanData);
    const interestLabels = findInterestLabels(interestData);
    drawLoanChart(loanData, loanLabels);
    drawInterestChart(interestData, interestLabels);
}

function drawInterestChart(datasets, labels) {
    if (interestChart) {
        interestChart.destroy();
    }
    const interestId = document.getElementById('interest-chart');
    const options = {
        maintainAspectRatio: false,
    }

    interestChart = new Chart(interestId, {
        type: 'bar',
        data: {
            labels: ["betaling"],
            datasets: datasets,
        },
        options: options
    });
}


interestRateChanged();