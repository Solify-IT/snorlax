import {NextFunction, Request, Response} from 'express';
import firebase from 'firebase-admin';
import IUserRepository from 'src/usecases/repository/userRepository';

const authMiddleware = (userRepository: IUserRepository) => async (req: Request, res: Response, next: NextFunction ) => {
    const token = req.headers.authorization; 

    if(!token){
        res.sendStatus(401);
        return;
    }

    const decoded = await firebase.auth().verifyIdToken(token);

    if (!decoded.email) {
        res.sendStatus(401);
        return;
    }
  
    const user = await userRepository.findOneOrNullByEmail(decoded.email);
  
    if (!user) {
        res.sendStatus(401);
        return;
    }

    req.currentUser = user;
    
    next();
};

export default authMiddleware;

