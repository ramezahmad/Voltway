let container = document.getElementById("container");

toggle = () => {
  container.classList.toggle("sign-in");
  container.classList.toggle("sign-up");
};

setTimeout(() => {
  container.classList.add("sign-up");
}, 200);

function toggleDarkMode() {
  const body = document.body;

  body.classList.toggle("dark-mode");
}

//register station
const station_id = document.getElementById("registerStationUsername");
const stationName = document.getElementById("registerStationName");
const email = document.getElementById("registerStationEmail");
const password = document.getElementById("registerStationPassword");
const passwordError = document.getElementById("passwordError");
const confirmPassword = document.getElementById(
  "registerStationConfirmPassword"
);
const confirmPasswordError = document.getElementById("confirmPasswordError");
const chargePointsNumber = document.getElementById(
  "registerStationChargePointsNumber"
);
const phone_no = document.getElementById("registerStationPhoneNumber");
const registerStationBtn = document.getElementById("registerStationBtn");
////////////////////////////////////////////////////////////////////////

//Map inputs
const mapModal = document.getElementById("mapModal");
let latitude = document.getElementById("latitude");
let longitude = document.getElementById("longitude");

//check if password has char ...etc
password.oninput = () => {
  var passwordPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  if (!passwordPattern.test(password.value)) {
    password.style.borderColor = "red";
    passwordError.textContent =
      "* Password must at least be 8 characters and contain at least A capital letter, a number and a special character";
    passwordError.style.display = "block";
  } else {
    password.style.borderColor = "";
    passwordError.textContent = "";
    passwordError.style.display = "none";
  }
};

//check if confirming is matching
confirmPassword.oninput = () => {
  if (password.value != confirmPassword.value) {
    password.style.borderColor = "red";
    confirmPassword.style.borderColor = "red";
    confirmPasswordError.textContent = "* Password is not matching";
    confirmPasswordError.style.display = "block";
  } else {
    password.style.borderColor = "";
    confirmPassword.style.borderColor = "";
    confirmPasswordError.style.display = "none";
  }
};

var map;
var marker;

function initializeMap() {
  // Initialize Leaflet map
  map = L.map("mapModalContent").setView([0, 0], 2);

  // Add a tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  // Add a marker to the map
  marker = L.marker([0, 0], { draggable: true }).addTo(map);

  // Event listener for marker dragend to update hidden input fields
  marker.on("dragend", function (event) {
    var markerLatLng = marker.getLatLng();
    latitude.value = markerLatLng.lat.toFixed(6);
    longitude.value = markerLatLng.lng.toFixed(6);
  });
  mapModal.style.display = "none";
}

function showMapModal() {
  // Open the map modal
  mapModal.style.display = "block";

  // Retrieve the selected coordinates from hidden input fields
  var currentLatLng = [
    Number(latitude.value),
    Number(longitude.value),
  ];

  // Update the marker position based on stored coordinates
  marker.setLatLng(currentLatLng);

  // Update map view to the marker's position
  map.setView(currentLatLng, 12);
}

function closeMapModal() {
  // Close the map modal
  mapModal.style.display = "none";
}

function saveSelectedLocation() {
  // Retrieve the selected coordinates from hidden input fields
  var selectedLatitude = Number(latitude.value);
  var selectedLongitude = Number(longitude.value);

  // Perform any additional actions you need when the user saves the selected location
  // Close the map modal
  closeMapModal();
  console.log('Selected Coordinates:', selectedLatitude, selectedLongitude);

  // Return the selected latitude and longitude values via the callback
  return [selectedLatitude, selectedLongitude];
}

function registerStation() {
  // Mapping between checkbox IDs and plug types
  const plugTypeMappings = {
    type1: { AC: "J1772 (Type 1)", DC: "CCS1" },
    type2: { AC: "J1772 (Type 1)", DC: "CHAdeMO" },
    type3: { AC: "GB/T", DC: "GB/T" },
    type4: { AC: "Mennekes (Type 2)", DC: "CCS2" },
    type5: { AC: "Tesla", DC: "Tesla Supercharger" },
  };

  // Create plugTypes array based on checked checkboxes
  const plugTypes = Object.entries(plugTypeMappings)
    .filter(([checkboxId]) => {
      const checkbox = document.getElementById(checkboxId);
      return checkbox.checked;
    })
    .map(([checkboxId]) => plugTypeMappings[checkboxId]);

   const [selectedLatitude,selectedLongitude]=saveSelectedLocation();
  
    // Create requestBody
    const requestBody = {
      station_id: station_id.value,
      name: stationName.value,
      email: email.value,
      phone_no: phone_no.value,
      chargePointsNumber: chargePointsNumber.value,
      feedback_rate:0,
      plugTypes: plugTypes,
      location: {
        type: "Point",
        coordinates: [selectedLatitude, selectedLongitude]
      },
      user_type: {
        user_id: station_id.value,
        password: password.value,
        userType: 'station'
      }
    };

    axios.post('http://localhost:3000/registerStation', requestBody)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response.data.error);
      });
    
    
}


// Call initializeMap when the page loads
document.addEventListener("DOMContentLoaded", initializeMap);

registerStationBtn.onclick = () => {
  registerStation();
};


