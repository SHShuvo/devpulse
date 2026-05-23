import {Router} from 'express';
import { issuesController } from './issues.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../../types';

const router = Router();

router.post('/', auth(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.createIssue);
router.get('/', issuesController.getIssues);
router.get('/:id', issuesController.getIssueById);
router.patch('/:id', auth(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.updateIssue);

export const issuesRouter = router;