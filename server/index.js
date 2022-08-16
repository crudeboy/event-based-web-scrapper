var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require('body-parser')
var TinyScraper = require('../tiny-scraper');
var indexRouter = require('./index.router');

var app = express();

// view engine setup
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyparser.json())
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

//scrapper
app.post('/scrapper', async (req, res) => {
    const { body } = req
    const { url } = body
    return await new TinyScraper().parseUrl('http://localhost:8000/url1').then((result) => {
        console.log(result, "result")
        res.json(result)
    })
    // console.log(scrapper, "scrapper")
    // return res.json(scrapper)
    // .parseUrl() .then((result) => {
    //     res.json(scrapper)
    // }).catch((error) => {
    //     res.json(error)
    // })
})

if(process.env.NODE_ENV === 'test') {
    module.exports = (port) => {
        console.log("app is listening .........")
        return app.listen(port || process.env.PORT || 8000);
    };
} else {
    console.log("app is listening .........")
    app.listen(process.env.PORT || 8000);
    module.exports = app;
}

// new TinyScraper('www.google.com')