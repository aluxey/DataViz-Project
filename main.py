import csv

# Function to read and sort CSV data
def sort_csv(input_file, output_file):
    with open(input_file, 'r', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        sorted_data = sorted(reader, key=lambda row: (row['Country'], int(row['Time'])))

    with open(output_file, 'w', newline='') as csvfile:
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(sorted_data)

# Example usage
if __name__ == '__main__':
    input_file = 'csv/data.csv'
    output_file = 'csv/dataSort.csv'
    sort_csv(input_file, output_file)
    print(f'Sorted data written to {output_file}')
