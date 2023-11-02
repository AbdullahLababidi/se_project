const flightData = [
    {
        Time: "14:30",
        Actual_Time: "14:35",
        Flight_Number: "ABC123",
        Type: 1,
        Country: "USA",
        City: "New York",
        Status: 5,
    },
    {
        Time: "15:00",
        Actual_Time: "15:05",
        Flight_Number: "XYZ789",
	Type: 2,
        Country: "Canada",
        City: "Toronto",
        Status: 3,
    },
];

function displayFlightData() {
    const flightList = document.getElementById("flightList");
    const headerRow = flightList.querySelector("tr.flightTitle");
    flightList.innerHTML = ""; // Clear the previous data

    const searchTerm = document.getElementById("searchInput").value.toLowerCase();

    flightList.appendChild(headerRow);

    flightData.forEach((flight) => {
        if (
            flight.Flight_Number.toLowerCase().includes(searchTerm) ||
            flight.Country.toLowerCase().includes(searchTerm) ||
            flight.City.toLowerCase().includes(searchTerm)
        ) {
	    let typeClass;
	    typeClass = "flightStatus1";
            let statusClass;
            if (flight.Status === 1) statusClass = "flightStatus1";
            else if (flight.Status === 2) statusClass = "flightStatus2";
            else if (flight.Status === 3) statusClass = "flightStatus3";
            else if (flight.Status === 4) statusClass = "flightStatus4";
            else if (flight.Status === 5) statusClass = "flightStatus5";
            else statusClass = "flightStatus6";

            const newRow = document.createElement("tr");
            newRow.classList.add("flightRow");
            newRow.innerHTML = `
                <td class="flightData">${flight.Time}</td>
                <td class="flightData">${flight.Actual_Time}</td>
                <td class="flightData">${flight.Flight_Number}</td>
                <td class="flightData ${typeClass}">${getTypeText(flight.Type)}</td>
                <td class="flightData">${flight.Country}</td>
                <td class="flightData">${flight.City}</td>
                <td class="flightData ${statusClass}">${getStatusText(flight.Status)}</td>
            `;

            flightList.appendChild(newRow);
        }
    });
}

function getTypeText(type) {
    switch (type) {
        case 1:
            return "Arrival";
        case 2:
            return "Departure";
        default:
            return "         ";
    }
}

// Function to get the status text based on status code
function getStatusText(status) {
    switch (status) {
        case 1:
            return "Arrived";
        case 2:
            return "Departing";
        case 3:
            return "Delayed";
	case 4:
	    return "Cancelled";
	case 5:
	    return "In Air";
	default:
	    return "stationary";
    }
}

// Function to refresh flight data
function refreshFlightData() {
    // Update the last update timestamp to the current date and time
    const lastUpdateTime = document.getElementById("lastUpdateTime");
    const now = new Date();
    lastUpdateTime.textContent = now.toLocaleString();

    // Refresh the flight data
    displayFlightData();
}

// Add event listeners for search and refresh
document.getElementById("searchInput").addEventListener("input", displayFlightData);

document.getElementById("refreshButton").addEventListener("click", refreshFlightData);


