const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);

// define port
const PORT = process.env.PORT || 3000;


app.use(webpackDevMiddleware(compiler, {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    stats: {
        colors: true,
    },
    historyApiFallback: true,
}));

/**
 * Add headers middleware 
 */
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


/**
 * Middleware for bodyParser
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * serve index.html
 */
app.use(express.static(__dirname + '/public'));


/**
 * Listen to Port
 */
app.listen(PORT, console.log('listening port ' + PORT));

//takes GET request from /calculate route with params
//used GET request with params because data doesn't need to be secure
app.get('/calculate/:startMonth/:startDay/:startYear/:diffDay', function (req, res) {
    let totalCost = 0;

    //made another prototype method of date object to caclulate days to add on start date
    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    }
    
    //date argument = startdate n argument = difference between startdate and enddate
    function price(date, n) {
        //price list based on number of week
        const weeklyPrices = {
            0: 5,
            1: 10,
            2: 15,
            3: 20,
            4: 25,
        }

        let sum = 0;
        //for loop while i < difference between starting date and ending date
        for (let i = 0; i < n; i++) {
            // use addDays method to calculate currentdate
            const currentDate = date.addDays(i)
            // get day index out of currentDate
            const dayOfWeek = currentDate.getDay()
            //check if day index is sunday or saturday
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                const dayOfMonth = currentDate.getDate()
                //need to improve this part. since I cannot divide it by 7, I cannot get .25 price values. 
                //if I devide it by 7, 7th day is calculated as next week's price
                const currentPrice = weeklyPrices[Math.floor(dayOfMonth / 8)]
                sum += currentPrice
            }
        }
        return sum / 100;
    }
    const startDate = new Date(req.params.startYear, req.params.startMonth - 1, req.params.startDay)

    // console.log(startDate, req.params.diffDay)
    //pass startdate and diffday as arguments. added 1 because startdate is included in calculation
    totalCost = price(startDate, parseInt(req.params.diffDay)+1)

    //send calculation back to client side
    res.send(JSON.stringify([totalCost]))
})