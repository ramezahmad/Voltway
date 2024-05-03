const logoutBtn = document.getElementById("logoutClear");

logoutBtn.onclick = () => {
  window.location.href = "login.html";
  localStorage.removeItem("token");
  localStorage.removeItem("userDetails");
};

const userDetails = JSON.parse(localStorage.getItem("userDetails"));
const plugTypeMappings = {
  north_america: { region: "north_america", AC: "J1772 (Type 1)", DC: "CCS1" },
  japan: { region: "japan", AC: "J1772 (Type 1)", DC: "CHAdeMO" },
  china: { region: "china", AC: "GB/T", DC: "GB/T" },
  eu: { region: "eu", AC: "Mennekes (Type 2)", DC: "CCS2" },
  tesla: { region: "tesla", AC: "Tesla", DC: "Tesla Supercharger" },
};

const chargerInfoElements = document.querySelectorAll(".info");
const totalChargers = userDetails.chargePointsNumber || 0;
const numberOfPlugTypes = userDetails.plugTypes.length;
const pointsPerPlugType = Math.floor(totalChargers / numberOfPlugTypes);

chargerInfoElements.forEach((infoElement) => {
  const region = infoElement.id;

  const matchingPlugType = userDetails.plugTypes.find(
    (type) =>
      type.AC === plugTypeMappings[region].AC &&
      type.DC === plugTypeMappings[region].DC
  );

  if (matchingPlugType) {
    const totalChargers = userDetails.chargePointsNumber || 0;
    let availableChargers = pointsPerPlugType || 0;
    let busyChargers = 0;
    infoElement.innerHTML = `
      <p>Total Chargers: ${pointsPerPlugType}</p>
      <p>Available Chargers: ${pointsPerPlugType}</p>
      <p>Busy Chargers: ${matchingPlugType.Busy || 0}</p>
      <button class="minus-btn btn btn-danger">busy</button>
      <button class="plus-btn btn btn-success">available</button>
      <p id="busyText" class="text-danger mt-3 text-center"></p>
    `;
    const minusBtn = infoElement.querySelector(".minus-btn");
    const plusBtn = infoElement.querySelector(".plus-btn");

    minusBtn.addEventListener("click", () => {
      if (availableChargers > 0) {
        availableChargers--;
        busyChargers++;
        updateChargerCounts();
      }
    });

    plusBtn.addEventListener("click", () => {
      if (availableChargers < pointsPerPlugType) {
        availableChargers++;
        busyChargers--;
        updateChargerCounts();
      }
    });

    function updateChargerCounts() {
      infoElement.querySelector(
        "p:nth-child(2)"
      ).textContent = `Available Chargers: ${availableChargers}`;
      infoElement.querySelector(
        "p:nth-child(3)"
      ).textContent = `Busy Chargers: ${busyChargers}`;
      // Display or hide the busy text based on the available chargers
      const busyText = document.getElementById("busyText");
      if (availableChargers == 0) {
        busyText.innerHTML = "This point is not Available";
      } else {
        busyText.innerHTML = "";
      }
    }
  } else {
    // If no match, set background red with white text and display a message
    infoElement.style.color = "red";
    infoElement.innerHTML = "You Don't Have this Charger";
  }
});

// Retrieve the existing pending requests from local storage or initialize an empty array
let Bookings = JSON.parse(localStorage.getItem("Bookings")) || [];

// Initialize or update the local storage with the pending requests array
localStorage.setItem("Bookings", JSON.stringify(Bookings));

const table = document.querySelector("table");
table.innerHTML = `
<tr>
<th>ID</th>
<th>customer ID</th>
<th>Car Model</th>
<th>Booking Date</th>
<th>Booking Time</th>
<th>Booking Duration</th>
<th>Booking Finish</th>
</tr>
`;
const peer = new Peer(userDetails.station_id);
// Event handler for when the receiver peer ID is assigned
peer.on("open", (id) => {
  console.log("Connected to PeerJS with ID:", id);
});

// Event handler for when a connection is established with another peer
peer.on("connection", (incomingConnection) => {
  // Store the incoming connection
  const conn = incomingConnection;

  // Event handler for when the data channel of the connection is open
  conn.on("open", () => {
    console.log("Connected with : " + incomingConnection.peer);
  
    conn.on("data", (data) => {
      console.log("Received message:", data);
  
      // Check if there is no existing booking with overlapping date and time range
      var isUnique = Bookings.every(function (item) {
        // Convert time strings to Date objects for easy comparison
        const existingStartTime = new Date(`1970-01-01T${item.startTime}`);
        const incomingStartTime = new Date(`1970-01-01T${data.startTime}`);
  
        // Calculate the end time based on the start time and time length
        const existingEndTime = new Date(existingStartTime.getTime() + item.timeLength * 60000);
        const incomingEndTime = new Date(incomingStartTime.getTime() + data.timeLength * 60000);
  
        // Check for overlapping time ranges
        return (
          item.selectDate !== data.selectDate ||
          item.customer_id !== data.customer_id ||
          (incomingStartTime >= existingEndTime || incomingEndTime <= existingStartTime)
        );
      });
  
      if (isUnique) {
        // Update the local Bookings array
        Bookings.push(data);
  
        // Update the local storage with the updated Bookings array
        localStorage.setItem("Bookings", JSON.stringify(Bookings));
  
        updateBookingsTable();
        conn.send("Booking done successfully, please arrive at the time" );
      }
      else {
        // Send suggested times as a response
        conn.send("Booking overlaps with existing bookings. OR you already have an active booking in this station");
      }
      document.querySelectorAll(".finish").forEach((finish)=>{
        finish.addEventListener('click', function(){
          conn.send("Your Session has been terminated")
          
        })
      })
    });
  });
});


// Event handler for PeerJS errors
peer.on("error", (error) => {
  console.error("PeerJS error:", error);
});

// Function to update the table for pending requests
function updateBookingsTable() {
  const table = document.querySelector("table");
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>customer ID</th>
      <th>Car Model</th>
      <th>Booking Date</th>
      <th>Booking Time</th>
      <th>Booking Duration</th>
      <th>Booking Finish</th>
    </tr>
  `;
  // Iterate over Bookings and create table rows
  for (let i = 0; i < Bookings.length; i++) {
    table.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${Bookings[i].customer_id}</td>
        <td>${Bookings[i].selectedCar}</td>
        <td>${Bookings[i].selectDate}</td>
        <td>${Bookings[i].startTime}</td>
        <td>${Bookings[i].timeLength} minutes</td>
        <td>
          <button class="btn btn-danger finish" onclick="finishRequest(${i})">Finish</button>
        </td>
      </tr>
    `;
  }
}

// Function to handle the "Finish" button click for accepted requests
function finishRequest(index) {
  
  // Retrieve the accepted requests from local storage
  const Bookings = JSON.parse(localStorage.getItem("Bookings")) || [];

  // Remove the item at the specified index from the accepted requests array
  Bookings.splice(index, 1);
  // Update the local storage with the updated accepted requests array
  localStorage.setItem("Bookings", JSON.stringify(Bookings));
  updateBookingsTable();
  
}
// Initial update of both tables


updateBookingsTable();

console.log(Bookings.length);
