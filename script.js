// Function to fetch and parse CSV data
async function fetchData() {
    try {
        const response = await fetch('dataSort.csv');
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

// Function to create a bar chart using Chart.js
function createChart(labels, data, chartId, chartTitle) {
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

// Main function to fetch data, parse it, and create charts
async function main() {
    const csvData = await fetchData();
    if (!csvData) return; // Exit if data fetching failed

    // Define countries to filter
    const selectedCountries = ['United States', 'Australia'];

    const { labels, values } = parseData(csvData, selectedCountries);

    createChart(labels, values, 'chart1', 'Food Waste in Tonnes');
}

// Call main function when script is loaded
main();
