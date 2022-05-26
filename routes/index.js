const express = require('express');
const router = express.Router();
const request = require('sync-request');

const cityModel = require('../models/cities');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

//===== Weather Home Page
router.get('/weather', async function(req, res, next){
  if(req.session.user == null){
    res.redirect('/')
  } else {
    let cityList = await cityModel.find();
    res.render('weather', {cityList})
  }
});

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Ajouter les données météorologiques de villes venant de l'API 
router.post('/add-city', async function(req, res, next){
  const data = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${req.body.newcity}&units=metric&lang=fr&appid=${WEATHER_API_KEY}`) 
  const dataAPI = JSON.parse(data.body)

  const alreadyExist = await cityModel.findOne({ name: req.body.newcity.toLowerCase() });

  if(alreadyExist == null && dataAPI.name){
    let newCity = new cityModel({
      name: req.body.newcity.toLowerCase(),
      desc:  dataAPI.weather[0].description,
      img: "http://openweathermap.org/img/wn/"+dataAPI.weather[0].icon+".png",
      temp_min: dataAPI.main.temp_min,
      temp_max: dataAPI.main.temp_max,
      lon: dataAPI.coord.lon,
      lat: dataAPI.coord.lat,
    });

    await newCity.save();
  }

  let cityList = await cityModel.find();

  res.render('weather', {cityList})
});

// Supprimer les donnée d'une ville
router.get('/delete-city', async function(req, res, next){
  await cityModel.deleteOne({
    _id: req.query.id
  })

  let cityList = await cityModel.find();
  res.render('weather', {cityList})
});

// Mise à jour des données
router.get('/update-cities', async function(req, res, next){
  let cityList = await cityModel.find();

  for(let i = 0; i< cityList.length; i++){
    let data = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${cityList[i].name}&units=metric&lang=fr&appid=b579367fa0a8c292cd14279abd3748a9`) 
    let dataAPI = JSON.parse(data.body)

    await cityModel.updateOne({
      _id: cityList[i].id
    }, {
      name: cityList[i].name,
      desc:  dataAPI.weather[0].description,
      img: "http://openweathermap.org/img/wn/"+dataAPI.weather[0].icon+".png",
      temp_min: dataAPI.main.temp_min,
      temp_max: dataAPI.main.temp_max,
    })
  }

   cityList = await cityModel.find();

  res.render('weather', {cityList})
});


module.exports = router;
