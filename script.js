// Function to fetch and parse CSV data
async function fetchFoodWasteData() {
    try {
        const response = await fetch('csv/dataSort.csv');
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

async function fetchGlobalFood() {
    try {
        const response = await fetch('csv/global-food.csv');
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
function parseFoodWasteData(data, selectedCountries) {
    const rows = data.trim().split('\n').slice(1); // Trim any extra whitespace and remove header

    // Initialize arrays to store parsed data
    const dataMap = new Map();

    rows.forEach(row => {
        const columns = row.split(',');
        if (columns.length >= 16) { // Ensure data format is correct
            const country = columns[1].replace(/"/g, ''); // Remove surrounding quotes
            const year = columns[12].replace(/"/g, '');
            const value = parseFloat(columns[14]);

            if (selectedCountries.includes(country)) { // Filter by selected countries
                const label = `${country} (${year})`;
                if (!dataMap.has(label)) {
                    dataMap.set(label, value);
                } else {
                    dataMap.set(label, dataMap.get(label) + value);
                }
            }
        }
    });

    // Convert map to arrays and sort by year
    const sortedData = [...dataMap.entries()]
        .sort((a, b) => {
            const yearA = parseInt(a[0].match(/\d+/)[0]); // Extract year from label
            const yearB = parseInt(b[0].match(/\d+/)[0]);
            return yearA - yearB;
        });

    const labels = sortedData.map(entry => entry[0]);
    const values = sortedData.map(entry => entry[1]);

    return { labels, values };
}

function parseDataWaste(data, selectedCountries) {
    const rows = data.trim().split('\n').slice(1); // Trim any extra whitespace and remove header

    // Initialize arrays to store parsed data
    const wasteMap = new Map();

    rows.forEach(row => {
        const columns = row.split(',');
        if (columns.length >= 16) { // Ensure data format is correct
            const country = columns[1].replace(/"/g, ''); // Remove surrounding quotes
            const typeWaste = columns[4].replace(/"/g, '');
            const value = parseFloat(columns[14]);

            if (selectedCountries.includes(country)) { // Filter by selected countries
                if (!wasteMap.has(typeWaste)) {
                    wasteMap.set(typeWaste, value);
                } else {
                    wasteMap.set(typeWaste, wasteMap.get(typeWaste) + value);
                }
            }
        }
    });

    // Convert map to arrays
    const sortedData = [...wasteMap.entries()];
    const labels = sortedData.map(entry => entry[0]);
    const values = sortedData.map(entry => entry[1]);

    return { labels, values };
}

// Function to parse CSV data and prepare it for Chart.js
function parseGlobalFood(data) {
    const rows = data.trim().split('\n').slice(1); // Trim any extra whitespace and remove header

    // Initialize arrays to store parsed data
    const regions = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America', 'World'];
    const valuesAfrica = [];
    const valuesAsia = [];
    const valuesEurope = [];
    const valuesNA = [];
    const valuesOceania = [];
    const valuesSA = [];
    const valuesWorld = [];

    rows.forEach(row => {
        const columns = row.split(',');
        if (columns.length >= 39) { // Ensure data format is correct
            switch (columns[2]) {
                case regions[0]:
                    valuesAfrica.push(columns[38]);
                    break;
                case regions[1]:
                    valuesAsia.push(columns[38]);
                    break;
                case regions[2]:
                    valuesEurope.push(columns[38]);
                    break;
                case regions[3]:
                    valuesNA.push(columns[38]);
                    break;
                case regions[4]:
                    valuesOceania.push(columns[38]);
                    break;
                case regions[5]:
                    valuesSA.push(columns[38]);
                    break;
                case regions[6]:
                    valuesWorld.push(columns[38]);
                    break;
                default:
                    break;
            }
        }
    });

    return { regions, valuesAfrica, valuesAsia, valuesEurope, valuesNA, valuesOceania, valuesSA, valuesWorld };
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

// Function to create a bar chart using Chart.js
function createFoodWasteChart(labels, data, chartId, chartTitle) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: chartTitle,
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Countries (Year)'
                    }
                }
            }
        }
    });
}

function createPieChartTypeOfWaste(labels, data, chartId, chartTitle) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const pieData = {
        labels: labels,
        datasets: [{
            label: chartTitle,
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };
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
    new Chart(ctx, {
        type: 'pie',
        data: pieData,
        options: options
    });
}

// Function to create a bar chart using Chart.js
function createGlobalFoodChart(regions, valuesAfrica, valuesAsia, valuesEurope, valuesNA, valuesOceania, valuesSA, valuesWorld, chartId, chartTitle) {
    const ctx = document.getElementById(chartId).getContext('2d');

    const start = 1961;
    const end = 2021;
    const numberList = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const data = {
        labels: numberList,
        datasets: [
            {
                label: regions[0],
                data: valuesAfrica,
                fill: false,
                borderColor: 'rgba(193,80,101,255)',
                tension: 0
            },
            {
                label: regions[1],
                data: valuesAsia,
                fill: false,
                borderColor: 'rgba(44,132,101,255)',
                tension: 0
            },
            {
                label: regions[2],
                data: valuesEurope,
                fill: false,
                borderColor: 'rgba(190,89,21,255)',
                tension: 0
            },
            {
                label: regions[3],
                data: valuesNA,
                fill: false,
                borderColor: 'rgba(109,62,145,255)',
                tension: 0
            },
            {
                label: regions[4],
                data: valuesOceania,
                fill: false,
                borderColor: 'rgba(207,10,102,255)',
                tension: 0
            },
            {
                label: regions[5],
                data: valuesSA,
                fill: false,
                borderColor: 'rgba(24,71,15,255)',
                tension: 0
            },
            {
                label: regions[6],
                data: valuesWorld,
                fill: false,
                borderColor: 'rgba(40,107,187,255)',
                tension: 0
            }
        ]
    };

    const chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            stacked: false,
            plugins: {
                title: {
                    display: true,
                    text: chartTitle
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    // grid line settings
                    grid: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                },
            }
        },
    });
}

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

// Main function to fetch data, parse it, and create charts
async function main() {
    displayFoodWasteCharts();
    displayGlobalFoodChart();
    displaySupermarketSalesChart();
}

async function displayFoodWasteCharts() {
    const csvData = await fetchFoodWasteData();
    if (!csvData) return; // Exit if data fetching failed

    // Define countries to filter
    const selectedCountries = ['France'];

    const { labels, values } = parseFoodWasteData(csvData, selectedCountries);
    createFoodWasteChart(labels, values, 'dataChart', 'Food Waste in Tonnes');
    
    const { labels: labelsWaste, values: valuesWaste } = parseDataWaste(csvData, selectedCountries);
    createPieChartTypeOfWaste(labelsWaste, valuesWaste, 'listTypeOfWaste', 'Repartition Type of Waste');
}

async function displayGlobalFoodChart() {
    const csvGlobalFood = await fetchGlobalFood();
    if (!csvGlobalFood) return; // Exit if data fetching failed

    const { regions, valuesAfrica, valuesAsia, valuesEurope, valuesNA, valuesOceania, valuesSA, valuesWorld } = parseGlobalFood(csvGlobalFood);
    createGlobalFoodChart(regions, valuesAfrica, valuesAsia, valuesEurope, valuesNA, valuesOceania, valuesSA, valuesWorld, 'globalFoodChart', 'kilocalorie supply from all foods per day, 1961 to 2021');
}

async function displaySupermarketSalesChart() {
    const csvSupermarketSales = await fetchSupermarketSales();
    if (!csvSupermarketSales) return; // Exit if data fetching failed
    
    const { types, values } = parseSupermarketSales(csvSupermarketSales);
    createSupermarketSalesBarChart(types, values, 'listTypeOfSupermarketSalesBar', 'Repartition type of supermarket sales');
    createSupermarketSalesPieChart(types, values, 'listTypeOfSupermarketSalesPie', 'Repartition type of supermarket sales');
}

// Call main function when script is loaded
main();
