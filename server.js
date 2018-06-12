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


app.get('/calculate/:startyear/:startmonth/:startday/:endyear/:endmonth/:endday', function(req,res) {
    let totalCost = 0;
    let weekCounter = 1
    Date.prototype.addDays = function(days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
      }
      
      function price(date, n) {
        const weeklyPrices = {
          0: 5,
          1: 10,
          2: 15,
          3: 20,
          4: 25,
        } 
      
        let sum = 0;
        for (let i = 0; i < n; i++) {
          const currentDate = date.addDays(i)
          const dayOfWeek = currentDate.getDay()
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            const dayOfMonth = currentDate.getDate()
            const currentPrice = weeklyPrices[Math.floor(dayOfMonth / 8)]
            sum += currentPrice
          }
        }
      
        return sum / 100;  
      }
      
    const startDate = new Date(req.params.startyear, req.params.startmonth-1, req.params.startday)
    const endDate = new Date(req.params.endyear, req.params.endmonth-1, req.params.endday) 
    const diffDay = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))

    totalCost = price(startDate,diffDay+1)
    // if(startDate.getDay() > 0 && startDate.getDay() <= 5 && start)
    res.send(JSON.stringify([totalCost]))
})