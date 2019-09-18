require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./movies-data-small.json')

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next)  {
    
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    if(!authToken || authToken.split(' ')[1] !==apiToken) {
        return res.status(401).json ({error: 'Unauthorized request'})
    }
    next();
})



app.get('/movie', function handleGetGenre(req, res){
    const {genre, country, avg_vote } = req.query;
    let results = movies;
    if(genre) {
        results = results
        .filter(movie =>
            movie
            .genre
            .toLowerCase()
            .includes(genre.toLowerCase()));
    }

    if(country) {
        results = results
        .filter(movie =>
            movie
            .country
            .toLowerCase()
            .includes(country.toLowerCase()));
    }

    if(avg_vote) {
        results = results
        .filter(movie =>
            Number
            (movie.avg_vote)
            >=Number(avg_vote))            
    }
    res.send(results)
})
//4 parameters in middleware, express knows to treat this as error handler
app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`listen on ${PORT}`);
})

