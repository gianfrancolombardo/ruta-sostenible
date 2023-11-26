window.onload = function() {
    populateDropdown();
    document.querySelector('form').addEventListener('submit', calculateFootprint);
};

function populateDropdown() {
    // Fetch data from JSON file
    fetch('../../info_20231125.json')
        .then(response => response.json())
        .then(data => {
            // Get the dropdown element
            let dropdown = document.getElementById('vehicleSelect');

            // Loop through the data
            data.forEach(item => {
                // Create new option element
                let option = document.createElement('option');
                option.value = item.id; // Store the id as the value
                option.text = item.vehicle;
                option.dataset.emissionsMin = item.emissionsMin; // Store the emissionsMin in a data attribute
                option.dataset.emissionsMax = item.emissionsMax; // Store the emissionsMax in a data attribute

                // Append the option to the dropdown
                dropdown.add(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

function calculateFootprint(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Kg per tree
    const kgPerTree = 10;

    // Get the selected vehicle
    let selectedVehicle = document.getElementById('vehicleSelect').selectedOptions[0];

    // Get the monthly kilometers
    let monthlyKm = document.getElementById('monthlyKm').value;

    // Calculate the max carbon footprint in kilograms per month
    let maxFootprintMonthly = (selectedVehicle.dataset.emissionsMax * monthlyKm) / 1000;

    // Calculate the max carbon footprint in kilograms per year
    let maxFootprintYearly = maxFootprintMonthly * 12;

    // Calculate the number of trees needed to neutralize the carbon footprint per month
    let maxTreesMonthly = maxFootprintMonthly / kgPerTree;

    // Calculate the number of trees needed to neutralize the carbon footprint per year
    let maxTreesYearly = maxFootprintYearly / kgPerTree;

    // Display the max carbon footprint in a card
    let resultCard = document.getElementById('resultCard');
    let maxFootprintDivMonthly = document.getElementById('maxFootprintMonthly');
    let maxFootprintDivYearly = document.getElementById('maxFootprintYearly');
    maxFootprintDivMonthly.innerHTML = maxFootprintMonthly.toFixed(2);
    maxFootprintDivYearly.innerHTML = maxFootprintYearly.toFixed(2);
    resultCard.style.display = 'block'; // Show the card

    // Display the number of trees in a card
    let treeCard = document.getElementById('treeCard');
    let treeCardBodyMonthly = document.getElementById('treeCardBodyMonthly');
    let treeCardBodyYearly = document.getElementById('treeCardBodyYearly');
    treeCardBodyMonthly.innerHTML = Math.ceil(maxTreesMonthly);
    treeCardBodyYearly.innerHTML = Math.ceil(maxTreesYearly);
    treeCard.style.display = 'block'; // Show the card
}