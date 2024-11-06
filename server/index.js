// zpQSeqVjHoWJhs1Z
require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const Joi = require("joi"); //For schema validation
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 9001; // Define port from environment variables or fallback to 9001

// Joi Schema For Validation of Job Data
const jobSchema = Joi.object({
  job_title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  max_price: Joi.number().required().min(0), // Ensure max_price is a positive number
  min_price: Joi.number().required().min(0).less(Joi.ref("max_price")), // min_price should be less than or equal to max_price
  deadline: Joi.date().required(), // Validate that the deadline is a valid date
  buyer: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    photo: Joi.string().uri().optional(), // Photo is optional, but must be a valid URI if provided
  }).required(),
});

// Configure CORS option
const corsOptions = {
  origin: ["http://localhost:5173"], // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, headers)
  optionSuccessStatus: 200, // Success status for CORS requests
};

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors(corsOptions)); // Enable CORS with specified options

// MongoDB connection URL
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

    // Fetch All Jobs
    app.get("/jobs", async (req, res) => {
      try {
        const result = await jobCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error Fecting jobs:", error);
        res.status(500).send({ message: "Failed tp fetch job" });
      }
    });

    // Fetch a Signle Job by ID
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

    // Save a Job with Validation
    app.post("/jobs", async (req, res) => {
      try {
        const jobData = req.body;

        //  Validat the incoming job data using Joi
        const { error } = jobSchema.validate(jobData);
        if (error) {
          res.status(400).send({ message: error.details[0].message });
        }

        const result = await jobCollections.insertOne(jobData);
        return res.status(201).send(result);
      } catch (err) {
        console.error("Error saving job", err);
        return res.status(500).send({ message: "Failed to save job" });
      }
    });

    // Fetch All the Posted Data by specific User
    app.get("/jobs/:email", async (req, res) => {
      const email = req.params.email;
      if (!email) return res.status(400).send({ message: "Email is required" });

      try {
        const query = { "buyer.email": email };
        const result = await jobCollections.find(query).toArray();

        res.status(200).send(result);
      } catch (err) {
        console.log("Error fetch in Job", err);
        res.status(500).send({ message: "Failed to fetch job" });
      }
    });
    //  Edit MyJob Post
    app.patch("/job/:id", async (req, res) => {
      const id = req.params.id;
      if (!id)
        return res
          .status(400)
          .send({ message: "Id not found while updating myJob post" }); // 400 means the server could not understand the request beacouse of invalid syntax
      try {
        const jobData = req.body;
        //Ensure jobData is not Empty(no update sent)
        if (!jobData || Object.keys(jobData).length === 0) {
          return res
            .status(400)
            .send({ message: "No data provided for update" }); // 400 : Bad Request
        }
        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: { ...jobData } };
        const option = { upsert: true };
        const result = await jobCollections.updateOne(
          filter,
          updateDoc,
          option
        );
        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Job not found" });
        }

        return res
          .status(200)
          .send({ message: "Job Updated Successfully", result }); // 200: Ok
      } catch (err) {
        console.log("Error in Updating MyPost job:", err);
        return res.status(500).send({ message: "Failed to fatch job" }); // 500: Internal Server Error
      }
    });

    //  Deleting MyPost Job
    app.delete("/job/:id", async (req, res) => {
      const { id } = req.params;

      //validating if the id is a valid objectId format
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid Job ID formate" }); // 400: Bad Request
      }
      const query = { _id: new ObjectId(id) };

      try {
        const result = await jobCollections.deleteOne(query);
        if (result.deletedCount === 1) {
          res.status(200).send({ message: "Job  Delete successfully", result });
        } else {
          res.status(404).send({ message: "Job not found" }); //404 : Not found
        }
      } catch (err) {
        console.error("Error Deleting Job", err);
        res.status(500).send({ message: "Failed to deleted job" }); //500: Internal Server Error
      }
    });

    //----- Route: Bid's -----

    //  Save a Bid
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

    // Fetch all bids  by specific user
    app.get("/mybids/:email", async (req, res) => {
      const email = req.params.email;
      if (!email)
        return res.status(400).send({ message: "Email is required " });
      try {
        const query = { user_email: email };
        const result = await bidCollections.find(query).toArray();
        res.status(200).send(result);
      } catch (err) {
        console.log("Error fetchiing bids for user", err);
        res.status(500).send({ message: "Failed to retrieve bids" }); // 500: Internal Error
      }
    });

    //Fetch bids request by specific user
    app.get("/bids-request/:email", async (req, res) => {
      const email = req.params.email;
      if (!email) return res.status(400).send({ message: "Email is required" }); // 400: Bad Request

      try {
        const query = { buyer_email: email };
        const result = await bidCollections.find(query).toArray();
        res.status(200).send(result);
      } catch (err) {
        console.log("Error Fetching bid request for user", err);
        res.status(500).send({ message: "Failed to retrieve bid request" }); // 500: Internal Error
      }
    });

    // Updating bid status
    app.patch("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body;
      console.log(status);

      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: status };
      const result = await bidCollections.updateOne(filter, updateDoc);
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
