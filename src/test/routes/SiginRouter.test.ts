import chai from 'chai';
import sinon, { SinonSpy } from 'sinon';
import express, { Router } from "express";
import SigninRouter from '../../routes/SigninRouter';
chai.use(require('sinon-chai'));

describe('sign in router', ()=>{
    let router: Router;
    let getSpy: SinonSpy;
    let postSpy: SinonSpy;
    before(()=>{
        getSpy = sinon.spy();
        postSpy = sinon.spy();
        router = express.Router();
        router.get = getSpy;
        router.post = postSpy;
        express.Router = () => router;
    });

    it('test that sign in is called with /signin get and post', ()=>{
        SigninRouter.create();
        chai.expect(getSpy.getCall(0).calledWithMatch('/signin')).to.be.true;
        chai.expect(postSpy.getCall(0).calledWithMatch('/signin')).to.be.true;
    })
})