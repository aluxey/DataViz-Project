// Function to fetch and parse CSV data
async function fetchData() {
    try {
        const response = await fetch('data.csv');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        console.log('LOL');
        return null;
    }
}

// Function to parse CSV data and prepare it for Chart.js
function parseData(data) {
    const rows = data.trim().split('\n').slice(1); // Trim any extra whitespace and remove header

    // Initialize arrays to store parsed data
    const labels = [];
    const values = [];

    rows.forEach(row => {
        const columns = row.split(',');
        if (columns.length >= 16) { // Ensure data format is correct
            const country = columns[1].replace(/"/g, ''); // Remove surrounding quotes
            const year = columns[12].replace(/"/g, '');
            const value = parseFloat(columns[14]);

            labels.push(`${country} (${year})`);
            values.push(value);
        }
    });

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

    const { labels, values } = parseData(csvData);

    createChart(labels, values, 'chart1', 'Food Waste in Tonnes');
}

// Call main function when script is loaded
main();
