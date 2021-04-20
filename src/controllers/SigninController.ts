import SigninDao from "../daos/Mongo/SigninDao";
import { SessionKey } from "ch-node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "ch-node-session-handler/lib/session/keys/SignInInfoKeys";

// For node environments only, not to be used in live. Live will
// use the CHS login and read the login data from the session.
class SigninController {

    signinDao:SigninDao;

    constructor() {
        this.signinDao = new SigninDao();
    }

    public getSigninPage(req: any, res: any) {
        res.render("signin");
    }

    public async submitSignin(req: any, res: any) {
        var username = req.body.username;
        var password = req.body.password;
        var result = await this.signinDao.checkSignin(username);
        
        if (result !== undefined && result.password === password) {
            this.populateSession(req, result);
            res.redirect("barcodeSearch");
        } else {
            res.render("signin", {
                error: true
            });
        }
    }

    private populateSession(req, result) {
        req.session.data = { };
        req.session.data[SessionKey.SignInInfo] = { 
            [SignInInfoKeys.SignedIn]: 1,
            [SignInInfoKeys.UserProfile]: result
        };
        return
    }
}

export default SigninController;