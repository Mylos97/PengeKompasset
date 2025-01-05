var interestRateInput = document.querySelector("#total-interest");
var monthlyPaymentInput = document.querySelector("#monthly-payment");
var totalAmount = 1000000;
var interestRate;
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

function calculateDataforDataset(inMonthlyPayment, datasetLoan) {
    let currentMoney = totalAmount;
    let runningInterest = 0;

    for (let i = 0; i < months + 1; i++) {
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

    return [datasetLoan, Math.floor(runningInterest)];
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
        datasetsInterest.push({payment: payment,cost: interestData});
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
    console.log(interestData);
    drawLoanChart(loanData, loanLabels);
    makeInterestList(interestData);
}

function makeInterestList(interestData) {
    const list = document.querySelector("#loan-list").querySelector("ul");
    list.innerHTML = '';

    interestData.forEach(data => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        const payment = document.createElement("strong");
        const cost = document.createElement("strong");
        payment.innerHTML = `${data.payment} kr.`;
        cost.innerHTML = `${data.cost} kr.`;

        p.appendChild(document.createTextNode("Månedlig betaling med "))
        p.appendChild(payment)
        p.appendChild(document.createTextNode(" ender med at koste "));
        p.appendChild(cost);
        p.appendChild(document.createTextNode(" i renter"));
        li.appendChild(p);
    
        list.appendChild(li);
    });
    
}
interestRateChanged();