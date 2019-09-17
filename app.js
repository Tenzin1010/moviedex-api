require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./movies-data-small.json')

app.use(morgan('common'));
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

const PORT = 8000;

app.listen(PORT, () => {
    console.log('listen on port 8000');
})

