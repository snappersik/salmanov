import { Router } from 'express';
import authorRouter from './AuthorRouter';
import bookRouter from './BookRouter';
import roleRouter from './RoleRouter';
import userRouter from './UserRouter';

const router: Router = Router();

router.use('/user/', userRouter);
router.use('/author', authorRouter);
router.use('/book', bookRouter);
router.use('/role/', roleRouter);

export default router;
