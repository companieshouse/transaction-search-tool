import chai from 'chai';
import sinon from 'sinon';
import SigninController from '../../controllers/SigninController';
import SigninDao from '../../daos/Mongo/SigninDao';

chai.use(require('sinon-chai'));

describe('sign in controller', ()=>{

    const req = {
        session: {
            data: {}
        },
        body: {
            username: 'name',
            password: 'password'
        }
    }

    const wrongReq = {
        session: {},
        body: {
            username: 'wrong',
            password: 'wrong'
        }
    }
    const res = {
        render: sinon.spy(),
        redirect: sinon.spy()
    };

    var signinController: SigninController;

    before(()=>{

        signinController = new SigninController();
        let signinDao = new SigninDao();

        var result = {
            name: 'name',
            password: 'password'
        }

        sinon.stub(signinDao, 'checkSignin').resolves(result);
        signinController.signinDao = signinDao;
    })

    it('test getSigninPage calls response render', ()=>{
        signinController.getSigninPage(req, res);
        chai.expect(res.render.calledOnce).to.be.true;
    })

    it('test submitSignin calls response redirect method with barcodeSearch when correct credentials are passed and render signin when not', async ()=>{

        await signinController.submitSignin(req, res);
        chai.expect(res.redirect.calledWithMatch("barcodeSearch")).to.be.true;
        await signinController.submitSignin(wrongReq, res);
        chai.expect(res.render.calledWithMatch("signin")).to.be.true;
    }).timeout(5000)
})