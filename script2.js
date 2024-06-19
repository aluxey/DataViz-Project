async function fetchSupermarketSales() {
    try {
        const response = await fetch('csv/supermarket_sales.csv');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to parse CSV data and prepare it for Chart.js
function parseSupermarketSales(data) {
    const rows = data.trim().split('\n').slice(1); // Trim any extra whitespace and remove header

    // Initialize arrays to store parsed data
    const types = ['Health and beauty', 'Electronic accessories', 'Home and lifestyle', 'Sports and travel', 'Food and beverages', 'Fashion accessories'];
    const values = [0, 0, 0, 0, 0, 0]

    rows.forEach(row => {
        const columns = row.split(',');
        if (columns.length >= 8) { // Ensure data format is correct
            switch (columns[5]) {
                case types[0]:
                    values[0] += parseInt(columns[7]);
                    break;
                case types[1]:
                    values[1] += parseInt(columns[7]);
                    break;
                case types[2]:
                    values[2] += parseInt(columns[7]);
                    break;
                case types[3]:
                    values[3] += parseInt(columns[7]);
                    break;
                case types[4]:
                    values[4] += parseInt(columns[7]);
                    break;
                case types[5]:
                    values[5] += parseInt(columns[7]);
                    break;
                default:
                    break;
            }
        }
    });

    return { types, values };
}

// Function to create a bar chart using Chart.j
function createSupermarketSalesBarChart(labels, data, chartId, chartTitle) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const datas = {
        labels: labels,
        datasets: [{
            label: chartTitle,
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)'
            ],
            borderWidth: 1
        }]
    }
    const chart = new Chart(ctx, {
        type: 'bar',
        data: datas,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            }
        }
    });
}

function createSupermarketSalesPieChart(labels, data, chartId, chartTitle) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const datas = {
        labels: labels,
        datasets: [{
            label: chartTitle,
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)'
            ],
            borderWidth: 1
        }]
    }
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: chartTitle
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw.toLocaleString();
                    }
                }
            }
        }
    };

    const chart = new Chart(ctx, {
        type: 'pie',
        data: datas,
        options: options
    });
}

async function displaySupermarketSalesChart() {
    const csvSupermarketSales = await fetchSupermarketSales();
    if (!csvSupermarketSales) return; // Exit if data fetching failed
    
    const { types, values } = parseSupermarketSales(csvSupermarketSales);
    createSupermarketSalesBarChart(types, values, 'listTypeOfSupermarketSalesBar', 'Repartition type of supermarket sales');
    createSupermarketSalesPieChart(types, values, 'listTypeOfSupermarketSalesPie', 'Repartition type of supermarket sales');
}

// Main function to fetch data, parse it, and create charts
async function main() {
    displaySupermarketSalesChart();
}

// Call main function when script is loaded
main();