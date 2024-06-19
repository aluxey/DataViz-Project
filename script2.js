
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
 

// Function to create a bar chart using Chart.js
function createGlobalFoodChart(regions, valuesAfrica, valuesAsia, valuesEurope, valuesNA, valuesOceania, valuesSA, valuesWorld, chartId, chartTitle) {
    const ctxGlobalFood = document.getElementById(chartId).getContext('2d');

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

    const chart = new Chart(ctxGlobalFood, {
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

// Main function to fetch data, parse it, and create charts
async function main() { 
 

    const csvGlobalFood = await fetchGlobalFood();
    if (!csvGlobalFood) return; // Exit if data fetching failed

    const { regions, valuesAfrica, valuesAsia, valuesEurope, valuesNA, valuesOceania, valuesSA, valuesWorld } = parseGlobalFood(csvGlobalFood);
    createGlobalFoodChart(regions, valuesAfrica, valuesAsia, valuesEurope, valuesNA, valuesOceania, valuesSA, valuesWorld, 'globalFoodChart', 'kilocalorie supply from all foods per day, 1961 to 2021');
 
}

// Call main function when script is loaded
main();
