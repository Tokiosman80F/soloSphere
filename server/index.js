require("dotenv").config(); // Load environment variables
const express = require("express"); // Import Express
const cors = require("cors"); // Import CORS middleware
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb"); // Import MongoDB client

const app = express(); // Initialize Express app
const port = process.env.PORT || 9001; // Define port from environment variables or fallback to 9001

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

    //get all the job data from db
    app.get("/jobs", async (req, res) => {
      const result = await jobCollections.find().toArray();
      res.send(result);
    });
    // get single job data from db
    app.get("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollections.findOne(query);
      res.send(result);
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
