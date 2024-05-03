

function getCustomer() {
    let customersTable = document.getElementById("customersTable");
  axios.get("http://localhost:3000/getAllCustomers").then((response) => {
    let customers = response.data.customers;
    for (customer of customers) {
      customersTable.innerHTML += `
        <tr>
        <td>${customer.customer_id}</td>
        <td>${customer.fname} ${customer.lname}</td>
        <td>${customer.email}</td>
        <td>${customer.phone_no}</td>
        <td>${customer.feedback_rate}</td>
        <td>
          <a href="#" class="btn btn-default"
            ><em class="fa fa-edit"></em
          ></a>
          <a href="#" class="btn btn-danger"
            ><em class="fa fa-trash"></em
          ></a>
        </td>
      </tr>
        
        `;
    }
  });
}

function getStation(){
    let stationsTable = document.getElementById('stationsTable');
    axios.get('http://localhost:3000/stations')
    .then(response =>{
        let stations = response.data;
        for(station of stations){
            let plugTypesHTML = '';
            for (let plugType of station.plugTypes) {
                // Assuming plugType has a property called 'type'
                plugTypesHTML += `
                <li>${plugType.DC}</li>
                `;
            }
            stationsTable.innerHTML+= `
                <tr>
                    <td>${station.station_id}</td>
                    <td>${station.name}</td>
                    <td>${station.email}</td>
                    <td>${station.phone_no}</td>
                    <td>${station.chargePointsNumber}</td>
                    <td>${station.feedback_rate}</td>
                    <td>${plugTypesHTML}</td>
                    <td>${station.location.coordinates[0]}<br>${station.location.coordinates[1]}</td>
                    <td>
          <a href="#" class="btn btn-default"
            ><em class="fa fa-edit"></em
          ></a>
          <a href="#" class="btn btn-danger"
            ><em class="fa fa-trash"></em
          ></a>
        </td>
                </tr>
            `
        }
    })
}

function getCar(){
    let carsTable = document.getElementById("carsTable");
    axios.get("http://localhost:3000/cars")
    .then(response=>{
        let cars = response.data;
        for(car of cars){
            carsTable.innerHTML +=`
                <tr>
                    <td>${car.car_id}</td>
                    <td>${car.model}</td>
                    <td>${car.plugType.DC}</td>
                    <td><img height="30" src="${car.carImage}"></td>
                    <td>
          <a href="#" class="btn btn-default"
            ><em class="fa fa-edit"></em
          ></a>
          <a href="#" class="btn btn-danger"
            ><em class="fa fa-trash"></em
          ></a>
        </td>
                </tr>
            `
        }
    })
}
getCustomer()
getStation()
getCar()