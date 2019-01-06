const router = new (require('restify-router')).Router();

const IndexController 	 = require('../controllers');
const StudentsController = require('../controllers/students');
const JobsController     = require('../controllers/jobs');
const AuthController     = require('../controllers/auth');

router.get('/', IndexController.getAll); 
router.post('/', IndexController.post);          
router.get('/a/:name', IndexController.get); 

router.post('/student', StudentsController.create);     // C
router.get('/student', StudentsController.getAll);      // R
router.get('/student/:id', StudentsController.get);     // R             
router.put('/student/:id', StudentsController.update);  // U
router.del('/student/:id', StudentsController.remove);  // D       

router.post('/job', JobsController.create);             // C
router.get('/job', JobsController.getAll);              // R
router.get('/job/:id', JobsController.get);             // R             
router.put('/job/:id', JobsController.update);          // U
router.del('/job/:id', JobsController.remove);          // D      

router.get('/auth/google', AuthController.authGoogle);
router.get('/auth/google/callback', AuthController.authGoogleCallback, AuthController.login);
router.get('/auth/google/loginFailed', AuthController.loginFailed);

module.exports = router;