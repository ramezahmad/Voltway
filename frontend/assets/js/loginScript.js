
let container = document.getElementById("container");


toggle = () => {
  container.classList.toggle("sign-in");
  container.classList.toggle("sign-up");
};


setTimeout(() => {
  container.classList.add("sign-in");
}, 200);

function toggleDarkMode() {
  const body = document.body;

  body.classList.toggle("dark-mode");
}

//login function for user and station
const loginBtn = document.getElementById("login-btn");
function getUser() {
  const email = document.getElementById("loginEmail");
  const password = document.getElementById("loginPassword");

  const requestBody = {
    email: email.value,
    password: password.value,
  };
  axios
    .post("http://localhost:3000/login", requestBody)
    .then((response) => {
      const token = response.data.token;
      const userDetails = response.data.userDetails;
      if(userDetails.userType =='station'){
        window.location.href = "stationDashboard.html";
      }
      else{
        window.location.href = "index.html";
      }
      localStorage.setItem("token", token);
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response.data.error);
    });
}

loginBtn.onclick = () => {
  getUser();
};

//register user function
const customer_id = document.getElementById("registerUserUsername");
const fname = document.getElementById("registerUserFname");
const lname = document.getElementById("registerUserLname");
const email = document.getElementById("registerUserEmail");
const password = document.getElementById("registerUserPassword");
const passwordError = document.getElementById("passwordError");
const confirmPassword = document.getElementById("registerUserConfirmPassword");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const phone_no = document.getElementById("registerUserPhoneNumber");
const registerBtn = document.getElementById("registerBtn");

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

function registerUser() {
  const requestBody = {
    customer_id: customer_id.value,
    fname: fname.value,
    lname: lname.value,
    email: email.value,
    phone_no: phone_no.value,
    feedback_rate: 0,
    user_type: {
      user_id: customer_id.value,
      password: password.value,
      userType: "customer",
    },
  };
  axios
    .post("http://localhost:3000/registerCustomer", requestBody)
    .then((response) => {
      container.classList.toggle("sign-in");
      container.classList.remove("sign-up");
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response.data.error);
    });
}

//localStorage.clear()
registerBtn.onclick = () => {
  registerUser();
};
