import * as chai from 'chai';
import * as sinon from 'sinon';
import * as express from "express";
import BarcodeSearchController from '../controllers/BarcodeSearchController';
import BarcodeSearchRouter from '../routes/BarcodeSearchRouter';
chai.use(require('sinon-chai'));

describe('barcode search router', ()=>{
    before(()=>{
        sinon.stub(express, 'Router').returns({
            get: sinon.spy()
        })
    });
    it('test that search is called', ()=>{
        const router = express.Router();
        BarcodeSearchRouter.create();
        chai.expect(router.get).to.have.been.calledWith('/search');
    })
})