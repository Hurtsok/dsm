var express = require('express'),
    app  = express(),
    swig = require('swig'),
    router = require(__dirname + '/config/routes')(express),
    stylus = require('stylus'),
    server;


//register template engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.set('staticPath', '/assets');
app.set('stylusPath', '/assets/scss/');
app.use(router);

app.use('/assets/stylesheets', function(req, res, next){
    var fs = require('fs'),
        styl = req.originalUrl.match(/(\d{1,}|\w{1,}|_{1,})\.css$/i), data, path;

    if(styl.length && styl[0]){
        var error = false;
        path =  __dirname + app.get('stylusPath') + styl[0].split('.')[0] + '.styl';
        //if(fs.exists(fs.realpathSync(path))){
            data = fs.readFileSync(path, { encoding: 'utf8' }, function(err, data){
                if (err) {
                    error = true;
                }
                else{
                    error = false;
                }
            });
            if(!error) {
                stylus(data).render(function (err, css) {
                    if (err) throw err;
                    fs.writeFileSync(__dirname + req.originalUrl, css);
                });
            }
        //}else{

        //}
    }
    next();
})

//static url
app.use('/assets', express.static(__dirname + app.get('staticPath')));
app.use('/images-samples', express.static(__dirname + '/images-samples'));

server = app.listen(3000, function () {
    console.log('Server is running at port ' + server.address().port);
})
