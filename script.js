// Function to fetch and parse CSV data
async function fetchData() {
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
 
// Function to parse CSV data and prepare it for Chart.js
function parseData(data, selectedCountries) {
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

 
// Function to create a bar chart using Chart.js
function createChart(labels, data, chartId, chartTitle) {
    const ctxData = document.getElementById(chartId).getContext('2d');
    const chart = new Chart(ctxData, {
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

function pieChartTypeOfWaste(labels, data, chartId, chartTitle) {
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
 
// Main function to fetch data, parse it, and create charts
async function main() {
    const csvData = await fetchData();
    if (!csvData) return; // Exit if data fetching failed

    // Define countries to filter
    const selectedCountries = ['France'];

    const { labels, values } = parseData(csvData, selectedCountries);
    createChart(labels, values, 'dataChart', 'Food Waste in Tonnes');

     
    const { labels: labelsWaste, values: valuesWaste } = parseDataWaste(csvData, selectedCountries);
    pieChartTypeOfWaste(labelsWaste, valuesWaste, 'listTypeOfWaste', 'Repartition Type of Waste');
}

// Call main function when script is loaded
main();
