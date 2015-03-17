module.exports = function(express){
    var router = express.Router();

    router.get('/', function(req, res){
        res.render('index.html', { base: req.protocol + '://' + req.hostname  + ':3000'})
    });

    router.get('/text-page', function(req, res){
        res.render('text-page.html', { base: req.protocol + '://' + req.hostname  + ':3000'})
    });

    return router;
}