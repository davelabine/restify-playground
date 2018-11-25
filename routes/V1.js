const router = new (require('restify-router')).Router();

const IndexController 	 = require('../controllers');
const StudentsController = require('../controllers/students');

router.get('/', IndexController.getAll); 
router.post('/', IndexController.post);          
router.get('/a/:name', IndexController.get); 

router.post('/student', StudentsController.create); // C
router.get('/student', StudentsController.get);     // R        
router.put('/student', StudentsController.update);  // U
router.del('/student', StudentsController.remove);  // D            

module.exports = router;