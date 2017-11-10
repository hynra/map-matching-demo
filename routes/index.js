const express = require('express');
const router = express.Router();
const http = require('http');
const configs = require('../configs').trackMatching;
const  fs = require('fs');
const qs = require('querystring')

router.get('/', async(req, res) => {
    try {
        let params = {
            app_id: configs.app_id,
            app_key: configs.api_key,
            'output.groupByWays': true,
            'output.linkGeometries': true,
            'output.osmProjection': false,
            'output.linkMatchingError': true,
            'output.waypoints': true,
            'output.waypointsIds': true
        };
        const options =
            { method: 'POST',
                host: 'test.roadmatching.com',
                path: '/rest/mapmatch/?' + qs.stringify(params),
                headers: { 'Content-Type':'application/gpx+xml', 'Accept':'application/json' }
            };
        let buffer = fs.readFileSync(__dirname+"/../tests/data/2538708.gpx");
        let callback = (response) => {
            let str = '';
            response.on('data', (chunk) => {
                str += chunk;
            });

            response.on('end', () => {
                console.log(str);
                res.render('index', {title: 'Express'});
            });
        };

        let request = http.request(options, callback);
        request.write( buffer );
        request.end();

    }catch (err){
        console.log(err);
        res.render('index', {title: 'ERROR'});
    }
});

module.exports = router;
