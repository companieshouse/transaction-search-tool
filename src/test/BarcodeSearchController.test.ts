import chai from 'chai';
import sinon from 'sinon';
import BarcodeSearchController from '../controllers/BarcodeSearchController';
import ChipsDao from '../daos/CHIPS/ChipsDao';
chai.use(require('sinon-chai'));

describe('barcode search controller', ()=>{

    const req = {
        query: {
            search: 'barcode'
        }
    }
    const res = {
        render: sinon.spy()
    };

    before(()=>{
        const chipsDao = {
            makeQuery: function() { }
        };
        const daoStub = sinon.stub().callsFake(()=>{return chipsDao;});
        sinon.stub(chipsDao, 'makeQuery').resolves({rows: ['data'] });
        Object.setPrototypeOf(ChipsDao, daoStub);
    })

    it('test getSearchPage calls response render', ()=>{
        BarcodeSearchController.getSearchPage(req, res);
        chai.expect(res.render.calledOnce).to.be.true;
    })

    it('test barcodeSearch calls response render method with barcode when called', ()=>{

        const expectedRender = {
            barcode: 'barcode',
            result: 'data'
        }
        return BarcodeSearchController.searchBarcode(req, res).then( ()=> {
            chai.expect(res.render).to.have.been.calledWithExactly("barcodeSearch", expectedRender);
        });
    })
})