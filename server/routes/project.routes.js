import express from 'express'
import projectCtrl from '../controllers/project.controller.js'


const router = express.Router()


router.route('/api/projects')
    .get(projectCtrl.list) //get a list of all the projects in db
    .post(projectCtrl.create) //create a project and post it in db
 

router.route('/api/projects/search')
    .post(projectCtrl.search)
    

router.route('/api/projects/:projectId')
    .get(projectCtrl.read) //when you click on a specific project
    .put(projectCtrl.update) //to edit a specific project
    .delete(projectCtrl.remove) //to delete a specific project

    
router.param('projectId', projectCtrl.projectByID)
    


// router.route('/api/projects/:projectId/addtag') //add tag in the tags list
//     .post(projectCtrl.addtag)


// router.route('/api/projects/:projectId/removetag') //remove tags from the tags list
//     .post(projectCtrl.removetag)


//Only thing that doesn't work
// router.route('/api/projects?sort=date_created') //return a list of all projects sorted by date created.
//     .get(projectCtrl.sortByDate) 


export default router




    

