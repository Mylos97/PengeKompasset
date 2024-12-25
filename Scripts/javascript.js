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
    drawChart();
});

function totalLoanAmountChanged() {
    totalAmount = totalAmountInput.value;
    drawChart();
}

function interestRateChanged() {
    interestRate = (interestRateInput.value * 0.01) / 4;
    console.log(interestRate);
    drawChart();
}

function loanYearsChanged() {
    loanYears = loanYearsInput.value;
    drawChart();
}

function monthlyPaymentChanged() {
    monthlyPayment = monthlyPaymentInput.value;
    drawChart();
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


function drawChart() {
    if (loanChart) {
        loanChart.destroy();
    }
    const loanId = document.getElementById('loan-chart');
    const interestId = document.getElementById('interest-chart');
    const options = {
        maintainAspectRatio: false,
    }

    const datasets = calculateRentData();
    const loanDatasets = datasets[0];
    const interestDatasets = datasets[1];
    const labels = findLabels(loanDatasets);
    console.log(datasets)
    loanChart = new Chart(loanId, {
        type: 'line',
        data: {
            labels: labels,
            datasets: loanDatasets,
        },
        options: options
    });

    interestChart = new Chart(interestId, {
        type: 'line',
        data: {
            labels: labels,
            datasets: interestDatasets,
        },
        options: options
    });
}