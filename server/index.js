require("dotenv").config(); // Load environment variables
const express = require("express"); // Import Express
const cors = require("cors"); // Import CORS middleware
const Joi = require("joi");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb"); // Import MongoDB client

const app = express(); // Initialize Express app
const port = process.env.PORT || 9001; // Define port from environment variables or fallback to 9001

// Joi Schema For Validation of Job Data
const jobSchema = Joi.object({
  job_title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  max_price: Joi.number().required(),
  min_price: Joi.number().required(),
  deadline: Joi.date().required(),
  buyer: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    photo: Joi.string().uri(),
  }).required(),
});

const corsOptions = {
  origin: ["http://localhost:5173"], // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, headers)
  optionSuccessStatus: 200, // Success status for CORS requests
};

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors(corsOptions)); // Enable CORS with specified options

// MongoDB setup with proper URI format
const uri = `mongodb+srv://${process.env.BUCKET}:${process.env.SECRET_BUCKET}@cluster0.lyiobzh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with Stable API version options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const jobCollections = client.db("soloSphere").collection("jobs");
    const bidCollections = client.db("soloSphere").collection("bids");

    //Route : Get All Jobs
    app.get("/jobs", async (req, res) => {
      try {
        const result = await jobCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error Fecting jobs:", error);
        res.status(500).send({ message: "Failed tp fetch job" });
      }
    });
    // Route: Get a Signle Job by ID
    app.get("/job/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await jobCollections.findOne(query);
        if (!result) {
          return res.status(404).send({ message: "Job not Found" });
        }
        res.send(result);
      } catch (err) {
        console.error("Error Fetching Job", err);
        res.status(500).send({ message: "Faild to fetch job" });
      }
    });
    // Route: Save a Bid
    app.post("/bids", async (req, res) => {
      try {
        const bidData = req.body;
        const result = await bidCollections.insertOne(bidData);
        res.send(result);
      } catch (err) {
        console.error("Error saving bid", err);
        res.status(500).send({ message: "Failed to save bid" });
      }
    });

    // Route: Save a Job with Validation
    app.post("/jobs", async (req, res) => {
      try {
        const jobData = req.body;
        //  Validat the incoming job data using Joi
        const { error } = jobSchema.validate(jobData);
        if (error) {
          res.status(400).send({ message: error.detail[0].message });
        }

        const result = await jobCollections.insertOne(jobData);
        res.send(result);
      } catch (err) {
        console.error("Error saving job", err);
        res.status(500).send({ message: "Failed to save job" });
      }
    });

    // Test the MongoDB connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error); // Log connection errors
    process.exit(1); // Exit the process in case of failure
  }
}

run().catch(console.dir); // Catch any unhandled promise rejections

// Basic API route for testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
