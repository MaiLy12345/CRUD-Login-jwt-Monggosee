const userValidation = require('../validations/user.js');
const controllerUser = require('../controllers/user.js');
const validate = require('express-validation');
const { authentication } = require('../middlewares/authentication-middleware.js');

const Joi =  require('joi');


exports.load = (app) => {
    app.post('/api/v1/users', validate(userValidation.creatUser()), controllerUser.createUser);
    app.post('/api/v1/login', controllerUser.login);
    app.delete('/api/v1/users/:id', validate(userValidation.deleteUser()) , controllerUser.deleteUser);
    app.get('/api/v1/users/:id', authentication, validate(userValidation.getUser()) , controllerUser.getUser);
    app.get( '/api/v1/users', controllerUser.getListUser);
    app.put('/api/v1/users/:id',  authentication, validate(userValidation.updateUser()) , controllerUser.updateUser);   
}
