const nhlRoutes = require('./nhl');

const constructorMethod = (app) => {
    app.use('/', nhlRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({error: 'This endpoint does not exist!'});
    });
};

module.exports = constructorMethod;