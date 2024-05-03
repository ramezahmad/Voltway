//call libraries
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

//import models
const User_Type = require("./models/User_Type");
const Customer = require("./models/Customer");
const Station = require("./models/Station");
const Car = require("./models/Car");
const Use = require("./models/Use");
const Charge = require("./models/Charge");
const Booking = require("./models/Booking");

//import Utils
const { hashPassword, verifyPassword } = require("./utils/bcryptUtils");

//initialize application

const app = express();
app.use(cors());
app.use(express.json());

const DB_NAME = process.env.DB_NAME;
const DB_CREDENTIALS = process.env.DB_CREDENTIALS;
const TOKEN_KEY = process.env.TOKEN_KEY;

//connect to mongodb
mongoose
  .connect(
    `mongodb+srv://${DB_NAME}:${DB_CREDENTIALS}.hckuum5.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected Successfully");
  })
  .catch((error) => {
    console.log("Connection failed : " + error);
  });
//end of connection

// endpoint to add customers
app.post("/registerCustomer", async (req, res) => {
  try {
    // Destructure and validate required parameters from the request body
    const {
      customer_id,
      fname,
      lname,
      email,
      phone_no,
      feedback_rate,
      user_type,
    } = req.body;

    // Check if any required parameter is missing or has a null value
    if (!customer_id || !fname || !lname || !email || !phone_no || !user_type) {
      return res
        .status(400)
        .json({ error: "Missing or null values in the request body" });
    }

    //check if the user exists
    const existingCustomer = await Customer.findOne({
      customer_id: customer_id,
    });

    if (existingCustomer) {
      return res
        .status(400)
        .json({ error: "Customer with the given ID already exists" });
    }

    const hashedPassword = await hashPassword(user_type.password);

    const newUserType = new User_Type({
      user_id: customer_id,
      password: hashedPassword,
      userType: "customer",
    });

    await newUserType.save();

    const newCustomer = new Customer({
      customer_id,
      fname,
      lname,
      email,
      phone_no,
      feedback_rate,
      user_type: newUserType._id,
    });

    await newCustomer.save();

    // Generate JWT token
    const token = jwt.sign({ user_id: customer_id }, TOKEN_KEY);

    const savedCustomer = await Customer.findById(newCustomer._id).populate(
      "user_type"
    );

    res.status(201).json({
      message: "Customer added successfully",
      customer: savedCustomer,
      token: token,
    });
  } catch (error) {
    console.error(`Error creating customer: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); //DONE

//endpoint to get all customers
app.get("/getAllCustomers", async (req, res) => {
  try {
    // Fetch all customers from the database
    const customers = await Customer.find();

    // If no customers are found, return an empty array
    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }

    // Return the list of customers
    res.status(200).json({
      message: "Customers retrieved successfully",
      customers: customers,
    });
  } catch (error) {
    console.error(`Error fetching customers: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to add stations
app.post("/registerStation", async (req, res) => {
  try {
    // Destructure and validate required parameters from the request body
    const {
      station_id,
      name,
      email,
      phone_no,
      chargePointsNumber,
      feedback_rate,
      plugTypes,
      location,
      user_type,
    } = req.body;

    // Check if any required parameter is missing or has a null value
    if (
      !station_id ||
      !name ||
      !email ||
      !phone_no ||
      !chargePointsNumber ||
      !plugTypes ||
      !location ||
      !user_type
    ) {
      return res
        .status(400)
        .json({ error: "Missing or null values in the request body" });
    }
    // Check if station_id already exists
    const existingStation = await Station.findOne({ station_id });

    if (existingStation) {
      return res
        .status(400)
        .json({ error: "Station with the given ID already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(user_type.password);

    // Create a new User_Type object with the hashed password
    const newUserType = new User_Type({
      user_id: station_id,
      password: hashedPassword,
      userType: "station",
    });

    await newUserType.save();

    // Create a new station object with the reference to the User_Type object
    const newStation = new Station({
      station_id,
      name,
      email,
      phone_no,
      chargePointsNumber,
      feedback_rate,
      plugTypes,
      location,
      user_type: newUserType, // You don't need to manually set _id, autopopulate will handle it
    });

    // Save the station to the database
    await newStation.save();

    // Generate JWT token
    const token = jwt.sign({ user_id: station_id }, TOKEN_KEY);

    // The autopopulate feature will automatically populate the user_type field
    // Retrieve the saved station
    const savedStation = await Station.findOne({ station_id }).populate(
      "user_type"
    );

    res.status(201).json({
      message: "Station added successfully",
      station: savedStation,
      token: token,
    });
  } catch (error) {
    console.error(`Error creating station: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); //DONE

//endpoint to get all stations
app.get("/stations", async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//get specific station
app.post("/station", async (req, res) => {
  try {
    const stationId = req.body.stationId;
    const station = await Station.findOne({ station_id: stationId });

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.json(station);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}); //DONE
// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if the email exists in either the Customer or Station collections
    const customer = await Customer.findOne({ email }).populate("user_type");
    const station = await Station.findOne({ email }).populate("user_type");

    if (!customer && !station) {
      return res.status(404).json({ error: "User not found" });
    }

    // Determine the user type
    const user = customer || station;
    const userType = user.user_type.userType;

    // Verify the password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.user_type.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_type.user_id, userType },
      TOKEN_KEY
    );

    // Return all attributes based on the user type
    const userDetails = {
      ...(userType === "customer"
        ? {
            customer_id: user.customer_id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            phone_no: user.phone_no,
            feedback_rate: user.feedback_rate,
            // Add other customer attributes as needed
          }
        : userType === "station"
        ? {
            station_id: user.station_id,
            name: user.name,
            email: user.email,
            phone_no: user.phone_no,
            chargePointsNumber: user.chargePointsNumber,
            feedback_rate: user.feedback_rate,
            plugTypes: user.plugTypes,
            location: user.location,
            // Add other station attributes as needed
          }
        : userType === "admin"
        ? {
            customer_id: user.customer_id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            phone_no: user.phone_no,
            feedback_rate: user.feedback_rate,
          }
        : {}),
      userType,
    };

    res.status(200).json({
      message: "Login successful",
      userDetails,
      token,
    });
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); //DONE

// Create a POST endpoint to add cars
app.post("/addCars", async (req, res) => {
  try {
    const { car_id, model, plugType, carImage } = req.body;

    // Check if the car with the same car_id already exists
    const existingCar = await Car.findOne({ car_id });

    if (existingCar) {
      return res
        .status(400)
        .json({ error: "Car with the same car_id already exists" });
    }

    // Create a new car instance
    const newCar = new Car({
      car_id,
      model,
      plugType,
      carImage,
    });

    // Save the new car to the database
    const savedCar = await newCar.save();

    res.status(201).json({ message: "Car added successfully", savedCar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); //DONE

//endpoint to get all cars
app.get("/cars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint for relationship between car and user
app.post("/uses", async (req, res) => {
  try {
    const { customerUseId, carUseId } = req.body;

    // Create a new Use document
    const newUse = new Use({
      customerUseId,
      carUseId,
    });

    // Save the Use document to the database
    await newUse.save();

    // Send a successful response with the created Use document
    res
      .status(201)
      .json({ message: "Use document added successfully", use: newUse });
  } catch (error) {
    console.error(`Error creating Use document: ${error.message}`);

    // Send an error response with a meaningful message
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//DONE

//endpoint for relationship between car and station
app.post("/charges", async (req, res) => {
  try {
    const { carChargeId, stationChargeId } = req.body;

    // Create a new Charge document
    const newCharge = new Charge({
      carChargeId,
      stationChargeId,
    });

    // Save the Charge document to the database
    await newCharge.save();

    // Send a successful response with the created Charge document
    res.status(201).json({
      message: "Charge document added successfully",
      charge: newCharge,
    });
  } catch (error) {
    console.error(`Error creating Charge document: ${error.message}`);

    // Send an error response with a meaningful message
    res.status(500).json({ error: "Internal Server Error" });
  }
}); //DONE

//endpoint for relationship between customer and station
app.post("/bookings", async (req, res) => {
  try {
    const { customerBookingId, stationBookingId } = req.body;

    // Create a new Booking document
    const newBooking = new Booking({
      customerBookingId,
      stationBookingId,
    });

    // Save booking document to the database
    await newBooking.save();

    // Send a successful response with the created Booking document
    res.status(201).json({
      message: "Booking document added successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error(`Error creating Booking document: ${error.message}`);

    // Send an error response with a meaningful message
    res.status(500).json({ error: "Internal Server Error" });
  }
}); //DONE

app.listen(3000, () => {
  console.log("I am listening in port 3000");
});
