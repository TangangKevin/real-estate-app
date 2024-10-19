const express = require('express');
const app = express();
const port = 3050;
const cors = require("cors");
const ejs = require('ejs');
const mongoose = require("mongoose");
const database = require('./database');
const User = require('./models/users');
const Property = require('./models/properties');

app.set("view engine", "ejs");
app. use(express.urlencoded({extended: true}));

// serving static files
app.use(express.static("public"));

app.get("/", (req, res) => {
    const searchTerm = req.query.searchTerm;   
    const properties = database.getProperties(searchTerm);
    res.render("home.ejs", { properties });});

app.get("/profile", (req, res) => {
    res.render("profile.ejs", { isLoggedIn: false });
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/register", async(req, res) => {
    try {
       const user = await User.create(req.body);
       //res.status(200).json(user); 
       res.render("profile.ejs", { isLoggedIn: true, user: req.body });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", async(req, res) => {
    try {
        const useremail = req.body.email;
        const userpassword = req.body.password;      
        const user = await User.findOne({ email: useremail, password: userpassword });
        
        if(user){
            res.render("profile.ejs", { isLoggedIn: true, user });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/add-property", (req, res) => {
    res.render("add-property.ejs");
})

app.post("/add-property", (req, res) => {
    const data = req.body;
    database.addProperty(data);
    res.redirect("/");
});

app.get("/action/:id", (req, res) => {
    const id = +req.params.id;
    const property = database.getProperty(id);
    if(!property){
        res.status(404).render("404.ejs");
        return;
    }
    res.render("action.ejs", { property });
});

app.listen(port, () => {
    console.log("server listening on port 3050");
});

