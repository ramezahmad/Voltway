function calculateDistance(userLocation, stationLocation) {
  const earthRadius = 6371; // Earth radius in kilometers

  // Convert latitude and longitude from degrees to radians
  const userLatRad = toRadians(userLocation.latitude);
  const userLngRad = toRadians(userLocation.longitude);
  const stationLatRad = toRadians(stationLocation.coordinates[0]); // <-- Change here
  const stationLngRad = toRadians(stationLocation.coordinates[1]); // <-- Change here

  // Calculate differences
  const latDiff = stationLatRad - userLatRad;
  const lngDiff = stationLngRad - userLngRad;

  // Haversine formula
  const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(userLatRad) * Math.cos(stationLatRad) * Math.sin(lngDiff / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate distance
  const distance = earthRadius * c;

  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Initialize PeerJS

//get stations
function getStations(selectedPlugType) {
  axios
    .get("http://localhost:3000/stations")
    .then((response) => {
      let stations = response.data;
      document.getElementById("stations").innerHTML = "";

      // Get user location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          // Filter stations based on plugType if a car is selected
          if (selectedPlugType) {
            stations = stations.filter((station) => {
              const supportsPlugType = station.plugTypes.some((plug) =>
                Object.keys(selectedPlugType).every(
                  (key) => plug[key] === selectedPlugType[key]
                )
              );
              return supportsPlugType;
            });
          }
          // Calculate distance for each station and add it to the station object
          stations = stations.map((station) => {
            const stationLocation = {
              coordinates: station.location.coordinates,
            };
            const distance = calculateDistance(userLocation, stationLocation);
            return { ...station, distance };
          });

          // Sort stations based on distance in ascending order
          stations.sort((a, b) => a.distance - b.distance);
          // Iterate through stations
          
          for (station of stations) {
            
            // Calculate distance for each station
            const stationLocation = {
              coordinates: station.location.coordinates,
            };
            const distance = calculateDistance(userLocation, stationLocation);
            document.getElementById("stations").innerHTML += `
                  <div class="col-md-6 col-sm-6">
                  <div class="single-service-item single-station">
                    <div class="">
                      <img src="./assets/images/car charge image.jpg" alt="" />
                    </div>
                    <div class="mb-2">
                      <h2><a href="https://www.google.com/maps?q=${
                        station.location.coordinates[0]
                      },${station.location.coordinates[1]}" target="_blank">${
              station.name
            }</a></h2>
                      <div class="station-info">
                        Phone no: ${station.phone_no} <br />
                        Charge points available: ${
                          station.chargePointsNumber
                        } <br />
                        Feedback rate: ${station.feedback_rate} <br />
                        Distance: ${distance.toFixed(2)} km<br />
                      </div>
                    </div>
    
                    <button data-toggle="modal" data-station-id="${
                      station.station_id
                    }" data-station-name="${station.name}" class="book-btn">
                      Book Now
                    </button>
                    <button data-toggle="modal" class="rate-btn" rate-station-name="${station.name}" data-station-id="${
                      station.station_id
                    }">Rate</button>
                  </div>
                </div>
                  `;
          }
          const bookBtn = document.querySelectorAll(".book-btn");
          bookBtn.forEach((button) => {
            button.addEventListener("click", function () {
              const selectedStationId = this.getAttribute("data-station-id");
              const selectedStationName = this.getAttribute("data-station-name");
              connectToPeer(selectedStationId,selectedStationName);
            });
          });
          const rateBtn = document.querySelectorAll(".rate-btn");
          rateBtn.forEach((button) => {
            button.addEventListener("click", function () {
              $("#rateStation").modal("show");
            })
          })
        },
        (error) => {
          console.error("Error getting user location:", error.message);
          // Handle errors here, e.g., display a message to the user
        }
      );
    })
    .catch((error) => {
      console.error("Error fetching cars:", error);
    });
}

// getCars function
function getCars() {
  let modelsSelect = document.getElementById("models");
  let makingSelect = document.getElementById("making");
  let selectCar = document.getElementById("selectCar");
  // Fetch cars
  axios
    .get("http://localhost:3000/cars")
    .then((response) => {
      let cars = response.data;

      // Clear existing options
      modelsSelect.innerHTML = "";

      // Add default option
      modelsSelect.innerHTML += '<option value="Default">Default</option>';

      // Add car options
      for (car of cars) {
        modelsSelect.innerHTML += `
            <option value="${car.car_id}">${car.model}</option>
          `;
      }
      for (car of cars) {
        selectCar.innerHTML += `
            <option value="${car.model}">${car.model}</option>
          `;
      }

      const apply = document.getElementById("applyButton");
      apply.addEventListener("click", function () {
        const selectedValue = modelsSelect.value;

        // Find the selected car object in the array
        const selectedCar = cars.find((car) => car.car_id === selectedValue);

        if (selectedCar) {
          const selectedPlugType = selectedCar.plugType;
          getStations(selectedPlugType);
        } else if (selectedValue === "Default") {
          // If "Default" is selected, show all stations
          getStations(null); // You can pass null or any other suitable value
        } else {
          console.error("Selected car not found.");
        }
      });

      makingSelect.addEventListener("change", function () {
        const selectedMaking = makingSelect.value;

        // Filter cars based on selectedMaking
        const filteredCars = cars.filter((car) =>
          car.car_id.includes(selectedMaking)
        );

        // Update modelsSelect dropdown with filtered cars
        updateModelsDropdown(filteredCars);
      });
    })
    .catch((error) => {
      console.error("Error fetching cars:", error);
    });

  // Function to update modelsSelect dropdown with filtered cars
  function updateModelsDropdown(filteredCars) {
    // Clear existing options
    modelsSelect.innerHTML = "";

    // Add default option
    modelsSelect.innerHTML += '<option value="Default">Default</option>';

    // Add filtered car options
    for (car of filteredCars) {
      modelsSelect.innerHTML += `
          <option value="${car.car_id}">${car.model}</option>
        `;
    }
  }
}
const userDetail = JSON.parse(localStorage.getItem("userDetails"));
//connect to peerJS
const peer = new Peer(userDetail.customer_id);
peer.on("open", (id) => {
  console.log("Connected to PeerJS with ID:", id);
  // Now you can use 'id' for identification or communication
});
peer.on("error", (error) => {
  console.error("PeerJS error:", error);
  $("#closedStation").modal("show");
});

//connect customer with station
function connectToPeer(peerId,stationName) {
  // Check if the provided ID is not the same as your own
  if (peerId !== peer.id) {
    // Connect to the specified peer ID
    const connection = peer.connect(peerId);
    // Event handler for when the connection is open
    connection.on("open", () => {
      console.log("Connected to station with ID:", peerId);
      $("#booking").modal("show");
      // Now you can send and receive data through this connection
    });

    connection.on("error", (error) => {
      alert("Error in connection with peer:", peerId, error);
    });

    // Event handler for receiving data from the connected peer
    connection.on("data", (data) => {
      
      if (data == "Booking done successfully, please arrive at the time") {
        $("#bookSuccess").modal("show");
        document.getElementById("successMessage").innerHTML = data;
        localStorage.setItem("bookingRequest", JSON.stringify(bookingRequestCustomer));
      }
      else if(data == "Your Session has been terminated"){
        $("#cancelled").modal("show");
        document.getElementById("cancelMessage").innerHTML = data
        localStorage.removeItem("bookingRequest")
      }
      else if (data == "Booking overlaps with existing bookings. OR you already have an active booking in this station"){
        $("#cancelled").modal("show");
        document.getElementById("cancelMessage").innerHTML = data
      }

      // Handle the received data as needed
    });

    // Event handler for when the connection is closed
    connection.on("close", () => {
      console.log("Connection with peer closed:", peerId);
    });

    // Event handler for errors in the connection
    document
      .getElementById("bookRequestBtn")
      .addEventListener("click", function () {
        // Get the values from the input fields
        const customer_id = userDetail.customer_id;
        const selectedCar = document.getElementById("selectCar").value;
        const selectDate = document.getElementById("selectDate").value;
        const startTime = document.getElementById("startTime").value;
        const timeLength = document.getElementById("timeLength").value;

        let bookingRequest = {
          customer_id,
          selectedCar,
          selectDate,
          startTime,
          timeLength,
        };
        let bookingRequestCustomer ={
          stationName:stationName,
          peerId,
          selectedCar,
          selectDate,
          startTime,
          timeLength
        }
        // Construct the message object

        if (connection && connection.open) {
          // Send the message
          connection.send(bookingRequest);
          localStorage.setItem("bookingRequest", JSON.stringify(bookingRequestCustomer));
          console.log("Message sent:", bookingRequest);
        }
      });
  } else {
    console.warn("Cannot connect to yourself.");
  }
}

//book request

//calling functions
getStations();
getCars();

const bookDetails = JSON.parse(localStorage.getItem("bookingRequest"));

if(bookDetails){
  document.getElementById("myBooking").innerHTML =`
    <p>Station's Name : ${bookDetails.stationName}</p>
    <p>Session Start at : ${bookDetails.startTime}</p>
    <p>Session Duration : ${bookDetails.timeLength} minutes</p>
  `
}
else{
  document.getElementById("myBooking").innerHTML = `
    <h5>You do not have any booking for now</h5>
  `
  document.getElementById("cancelSessionBtn").style.display = 'none'
}

document.getElementById("cancelSessionBtn").addEventListener("click", function(){
  $("#cancelled").modal("show");
  document.getElementById("cancelMessage").innerHTML = "Your Session has been terminated";
  localStorage.removeItem("bookingRequest");
})
