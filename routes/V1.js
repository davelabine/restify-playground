const router = new (require('restify-router')).Router();

const IndexController 	 = require('../controllers/index.controller');
const StudentsController = require('../controllers/students.controller');

router.get('/', IndexController.getAll); 
router.post('/', IndexController.post);          
router.get('/a/:name', IndexController.get); 

router.post('/students', StudentsController.create); // C
router.get('/students', StudentsController.get);     // R        
router.put('/students', StudentsController.update);  // U
router.del('/students', StudentsController.remove);  // D            

module.exports = router;