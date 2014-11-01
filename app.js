/**
 * Module dependencies.
 */
 /*
In package.json
    "ejs": "*",
    "reload": "JediMindtrick/reload"

In shell
supervisor -e 'html|js' node app.js
or just
npm start
*/
var express = require('express'),
http = require('http'),
path = require('path'),
reload = require('reload');

app = express();

// all environments
app.set('port', process.env.PORT || 7070);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.json(false));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res) {
    res.render('index.html');
});

app.get('/crossfilter', function(req, res) {
    res.render('crossfilter.html');
});

app.get('/MyCrossfilter', function(req, res) {
    res.render('myCrossfilter.html');
});

app.get('/MyStackedBars',function(req,res){
    res.render('myStackedBars.html');
});

app.get('/StackedBars',function(req,res){
    res.render('sampleStackedBars.html');
});

app.get('/BarTooltips',function(req,res){
    res.render('sampleBarsWTooltips.html');
});

app.get('/MyBarTooltips',function(req,res){
    res.render('myBarsWTooltips.html');
});

server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

reload.all(server,app);
