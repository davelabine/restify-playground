const router = new (require('restify-router')).Router();

const IndexController 	= require('../controllers/index.controller');

router.get('/', IndexController.getAll); 
router.post('/', IndexController.post);          

router.get('/a/:name', IndexController.get); 
   

module.exports = router;