// Function to fetch and parse CSV data
async function fetchData() {
    try {
        const response = await fetch('csv/data.csv');
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





// Function to parse CSV data and prepare it for Chart.js
function parseData(data, selectedCountries) {
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

            if (selectedCountries.includes(country)) { // Filter by selected countries
                labels.push(`${country} (${year})`);
                values.push(value);
            }
        }
    });

    return { labels, values };
}



// Function to parse CSV data and prepare it for Chart.js
function parseGlobalFood(data, selectedCountries) {
    const rows = data.trim().split('\n').slice(1); // Trim any extra whitespace and remove header

    // Initialize arrays to store parsed data
    const labels = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America', 'World'];
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
                case labels[0]:
                    valuesAfrica.push(columns[38]);
                    break;
                case labels[0]:
                    valuesAsia.push(columns[38]);
                    break;
                case labels[0]:
                    valuesEurope.push(columns[38]);
                    break;
                case labels[0]:
                    valuesNA.push(columns[38]);
                    break;
                case labels[0]:
                    valuesOceania.push(columns[38]);
                    break;
                case labels[0]:
                    valuesSA.push(columns[38]);
                    break;
                case labels[0]:
                    valuesWorld.push(columns[38]);
                    break;
                default:
                    break;

              }
              

            const country = columns[1].replace(/"/g, ''); // Remove surrounding quotes
            const year = columns[12].replace(/"/g, '');
            const value = parseFloat(columns[14]);

            if (selectedCountries.includes(country)) { // Filter by selected countries
                labels.push(`${country} (${year})`);
                values.push(value);
            }
        }
    });

    return { labels, valuesAfrica, valuesAsia, valuesEurope, valuesNA, valuesOceania, valuesSA, valuesWorld };
}






// Function to create a bar chart using Chart.js
function createDataChart(labels, data, chartId, chartTitle) {
    const ctxDataChart = document.getElementById(chartId).getContext('2d');
    const chart = new Chart(ctxDataChart, {
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





// Function to create a bar chart using Chart.js
function createGlobalFoodChart(label, valuesAfrica, valuesAsia, valuesEurope, valuesNA, valuesOceania, valuesSA, valuesWorld, chartId, chartTitle) {
    const ctx = document.getElementById(chartId).getContext('2d');

    const start = 1961;
    const end = 2021;
    const numberList = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const data = {
      labels: numberList,
      datasets: [
        {
          label: label[0],
          data: valuesAfrica,
          yAxisID: 'y',
        },
        {
          label: label[1],
          data: valuesAsia,
          yAxisID: 'y',
        },
        {
          label: label[2],
          data: valuesEurope,
          yAxisID: 'y',
        },
        {
          label: label[3],
          data: valuesNA,
          yAxisID: 'y',
        },
        {
          label: label[4],
          data: valuesOceania,
          yAxisID: 'y',
        },
        {
          label: label[5],
          data: valuesSA,
          yAxisID: 'y',
        },
        {
          label: label[6],
          data: valuesWorld,
          yAxisID: 'y',
        },
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

// Main function to fetch data, parse it, and create charts
async function main() {
    const csvData = await fetchData();
    if (!csvData) return; // Exit if data fetching failed

    // Define countries to filter
    const selectedCountries = ['Austria', 'France', 'Germany'];

    const { labels, values } = parseData(csvData, selectedCountries);

    createDataChart(labels, values, 'dataChart', 'Food Waste in Tonnes');




    
    // const csvGlobalFood = await fetchGlobalFood();
    // if (!csvGlobalFood) return; // Exit if data fetching failed


    // const { regions, valuesAfrica, valuesAsia, valuesEurope, valuesNA, valuesOceania, valuesSA, valuesWorld } = parseGlobalFood(csvGlobalFood);

    // createGlobalFoodChart(regions, valuesAfrica, valuesAsia, valuesEurope, valuesNA, valuesOceania, valuesSA, valuesWorld, 'globalFoodChart', 'kilocalorie supply from all foods per day, 1961 to 2021');
}

// Call main function when script is loaded
main();
