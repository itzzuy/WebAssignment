/********************************************************************************
* BTI425 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: The Duy Vu   Student ID: 153273222  Date: 17-01-2025
*
* Published URL: https://web-assignment-kappa.vercel.app/
*
********************************************************************************/

const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const ListingsDB = require('./modules/listingsDB.js')
const db = new ListingsDB()
const HTTP_PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json({ message: 'API Listening'})
});
// Add a new listing
app.post('/api/listings', async(req, res) => {
    try {
        const newListing = await db.addNewListing(req.body)
        console.log("Added a new listing!!!!")
        res.status(201).json(newListing)
    } catch(err) {
        res.status(500).json({ Error: "Cannot add listing: ", err })
    }
});
// Retrieve all listing with a specific page
app.get('/api/listings', async(req, res) => {
    const { page, perPage, name } = req.query
    try {
        const listings = await db.getAllListings(page, perPage, name)
        res.json(listings)
    } catch(err) {
        res.status(500).json({ Error: "Cannot retrieve listing: ", err })
    }
})
// Retrieve specific listing with a specific page
app.get('/api/listings/:id', async(req, res) => {
    try {
        const uniqueList = await db.getListingById(req.params._id)
        if (uniqueList) {
            res.json(uniqueList)
        } else {
            res.status(404).json({ Error: "Listing not found!!!" })
        }
    } catch(err) {
        res.status(500).json({ Error: "Cannot retrieve listing: ", err })
    }
})
// Update listing with a specific id
app.put('/api/listings/:id', async(req, res) => {
    try {
        const updateList = await db.updateListingById(req.params.id)
        res.json(updateList)
    } catch(err) {
        res.status(500).json({ Error: "Failed to update listing: ", err })
    }
})
// Delete listing with a specific id
app.delete('/api/listings/:id', async(req, res) => {
    try {
        const deleteList = await db.deleteListingById(req.params.id)
        res.status(204).send()
    } catch(err) {
        res.status(500).json({ Error: "Failed to delete listing: ", err })
    }
})
// Initialize the database and attempt to start the server
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`)
    });
}).catch((err) => { console.error('Cannot start the server: ', err) });