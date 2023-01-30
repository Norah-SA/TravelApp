var path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')

let projectData = {}

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//cors
app.use(cors())
//dist
app.use(express.static('dist'));

// Setup Server
const port = 8088
app.listen(port, function () {
    console.log(`http://localhost:${port}`)
})

//GET
app.get('/',(req,res)=>{
    res.sendFile('dist/index.html')
})

//POST
app.post('/add', (req,res)=>{
    //function
    projectData = {
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        temp: req.body.temp,//weather
        summary: req.body.summary,//temp
        daysLeft: req.body.daysLeft,
        cityImage: req.body.cityImage
    }
    res.send(projectData)
})