import SigninController from '../controllers/SigninController';
import * as express from "express";
import bodyParser from "body-parser";


class SigninRouter {

    public static create() {
        const router = express.Router();

        var signinController = new SigninController();

        router.get("/signin", (req, res) => signinController.getSigninPage(req, res));
        router.post("/signin", bodyParser.urlencoded({extended:false}), (req, res) => signinController.submitSignin(req, res));
        return router;
    }
}

export default SigninRouter;