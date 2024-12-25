const totalAmountInput = document.querySelector("#total-loan");
const interestRateInput = document.querySelector("#total-interest");
const loanYearsInput = document.querySelector("#loan-years");
const monthlyPaymentInput = document.querySelector("#monthly-payment");

var totalAmount = totalAmountInput.value;
var interestRate;
var loanYears = loanYearsInput.value;
var monthlyPayment = monthlyPaymentInput.value;
var interestPayment = 3;
var loanChart;
var interestChart;

window.addEventListener("DOMContentLoaded", function () {
    interestRateChanged();
    drawCharts();
});

function totalLoanAmountChanged() {
    totalAmount = totalAmountInput.value;
    drawCharts();
}

function interestRateChanged() {
    interestRate = (interestRateInput.value * 0.01) / 4;
    console.log(interestRate);
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

function findLabels(datasets) {
    const labels = [];

    datasets[0].data.forEach((element, i) => {
        labels.push(`Month${i + 1}`)
    });
    return labels;
}

function createDatasetLoan(monthlyPayment) {
    const datasetLoan = {
        label: `Total betalt med månedlig betalign: ${monthlyPayment}`,
        data: [],
        tension: 0.1,
        pointRadius: 1
    };
    return datasetLoan; 
}

function createDatasetInterest(monthlyPayment) {
    const datasetInterest = { 
        label: `Rente betalt med månedlig betalign: ${monthlyPayment}`,
        data: [],
        tension: 0.1,
        pointRadius: 1
    };
    return datasetInterest;
}

function getMonthlyPayments() {
    const monthlyPayments = []
    var currentMonthlyPayment = parseInt(monthlyPayment);
    for(let i = 0 ; i < 4; i++) {
        monthlyPayments.push(currentMonthlyPayment);
        currentMonthlyPayment += 1000;
    }

    return monthlyPayments;
}

function calculateDataforDataset(inMonthlyPayment, datasetLoan, datasetInterest ) {
    const months = 12 * loanYears;
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
        datasetInterest.data.push(runningInterest);

        if (currentMoney <= 0) {
            break;
        }
    }

    return [datasetLoan, datasetInterest];
}

function calculateRentData() {
    const monthlyPayments = getMonthlyPayments();
    const datasetsLoan = [];
    const datasetsInterest = [];
    monthlyPayments.forEach(payment => {
        const currentDatasetLoan = createDatasetLoan(payment);
        const currentInterest = createDatasetInterest(payment);
        const output = calculateDataforDataset(payment, currentDatasetLoan, currentInterest);
        datasetsLoan.push(output[0]);
        datasetsInterest.push(output[1]);
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
    const interestData = datasets[0];
    const interestLabels = findLabels(interestData);
    const loanData = datasets[1]
    drawInterestChart(interestData, interestLabels);
    drawLoanChart(loanData, interestLabels);
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
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: options
    });
}