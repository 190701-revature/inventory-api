import express, { Request, Response } from 'express';

const userRouter = express.Router();

userRouter.post('/', (request: Request, response: Response) => {
    const payload = request.body;
    request.session.uid = payload.id;
    request.session.name = payload.name;
    response.sendStatus(201);
});

userRouter.get('/', (request: Request, response: Response) => {
    response.json({message: `Hello ${request.session.name}!`});
});

export default userRouter;
