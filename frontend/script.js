//login button navbar
const loginBtn = document.getElementById("loginBtn");

//services
const service1 = document.getElementById("service1");
const service2 = document.getElementById("service2");
const service3 = document.getElementById("service3");

const token = localStorage.getItem("token");
const userDetails = localStorage.getItem("userDetails");
const dashboard =document.getElementById("dashboard");
const adminDashboard = document.getElementById("adminDashboard");

if (token && userDetails) {
  loginBtn.setAttribute("data-toggle", "modal");
  loginBtn.href = "#flipFlop";
  loginBtn.innerHTML = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="40"
  height="25"
  fill="currentColor"
  class="bi bi-person-circle"
  viewBox="0 0 16 16">
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
  <path
    fill-rule="evenodd"
    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
  ></svg>`;
  const userInfo = JSON.parse(userDetails);
  if(userInfo.userType == 'station'){
    dashboard.style.display = 'block';
    adminDashboard.style.display = 'none';
  }
  else if (userInfo.userType == 'admin'){
    adminDashboard.style.display='block';
    dashboard.style.display = 'none';
  }
  else{
    dashboard.style.display = 'none';
    adminDashboard.style.display = 'none';
  }
  service1.href = "stations.html";
  service2.href = "maintenance.html"
  service3.href = "chatbot.html";
} else {
  loginBtn.removeAttribute("data-toggle");
  loginBtn.href = "login.html";
  loginBtn.innerHTML = `Login`;
  service1.href = "login.html";
  service2.href = "login.html";
  service3.href = "login.html";
  dashboard.style.display = 'none';
  adminDashboard.style.display = 'none';
}


function logout() {
  localStorage.clear()
  window.location.href = 'index.html';
}
