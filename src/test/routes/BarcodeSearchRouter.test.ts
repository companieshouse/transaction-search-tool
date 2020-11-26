import chai from 'chai';
import sinon, { SinonSpy } from 'sinon';
import express, { Router } from "express";
import BarcodeSearchRouter from '../../routes/BarcodeSearchRouter';
chai.use(require('sinon-chai'));

describe('barcode search router', ()=>{
    let router: Router;
    let spy: SinonSpy;
    before(()=>{
        spy = sinon.spy();
        router = express.Router();
        router.get = spy;
        express.Router = () => router;
    });

    it('test that search is called', ()=>{
        BarcodeSearchRouter.create();
        chai.expect(spy.getCall(0).calledWithMatch('/')).to.be.true;
        chai.expect(spy.getCall(1).calledWithMatch('/search')).to.be.true;
    })
})