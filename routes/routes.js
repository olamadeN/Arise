/* const express= require('express');
const router = express.Router(); */
const { Router } = require('express');
const router = Router();
const authController = require('../controller/authController');
const galController = require('../controller/galController');
const galmiddle = require('../middleware/imageupload');

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);

router.get('/login', authController.admin_login);
router.post('/login',  authController.admin_login_post);

router.get('/logout', authController.admin_logout);

/* Gaallery */
router.post('/upload', galmiddle.upload.single('thumb'), galController.categoryUpload);
router.get('/upload', galController.categoryGet);
router.get('/upload/:id', galController.categoryGetOne);
router.delete('/upload/:id', galController.categoryDel);
router.patch('/upload/:id', galController.categoryUpdate);

router.post('/all_projects', galmiddle.upload.any('pictures', 5), galController.projectUpload);
router.get('/all_projects', galController.projectGet);
router.get('/all_projects/:id', galController.projectCat);
router.get('/all_projects/:category/:id', galController.projectGetOne);
router.delete('/all_projects/:id', galController.projectDel);
router.patch('/all_projects/:id', galController.projectUpdate);
/* router.post('/project_upload', galmiddle.upload.single('pictures'), galController.projectUpload) */
module.exports = router;
