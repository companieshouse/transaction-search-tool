import { expect } from 'chai';
import * as sinon from 'sinon';
import * as oracledb from 'oracledb';
import ChipsDao from '../daos/CHIPS/ChipsDao';

const config = {
    user: "USER",
    password: "PASSWORD",
    connectionString: "CONSTRING"
};

const DATA = {
    "XXXX1234": { transaction_id: "123456789", orgunit_desc: "ORG UNIT DESC" }
}

const CORRECT_BARCODE = "XXXX1234";
const INCORRECT_BARCODE = "YYYY1234";

const chipsDao = new ChipsDao();
const error = new Error('test error');
  
describe('Chips database call', () => {
    before( async ()=> {
        sinon.stub(oracledb, 'getConnection').resolves({
            execute: function() {},
            close: function() {}
        });
        let connection = await oracledb.getConnection(config);
        connection.execute = sinon.stub();
        connection.execute.withArgs(CORRECT_BARCODE, sinon.match.any).resolves({
            rows: {"XXXX1234": { transaction_id: "123456789", orgunit_desc: "ORG UNIT DESC" }}
        });
    })
    after(()=> {
        oracledb.getConnection.restore();
    })

    it('test makeQuery returns data when correct barcode is provided', async () => {
        let result = await chipsDao.makeQuery(CORRECT_BARCODE, ["bind value 1"]);
        expect(result.rows[CORRECT_BARCODE]).to.deep.equal(DATA[CORRECT_BARCODE]);
    })

    it('test makeQuery returns empty when incorrect barcode is provided', async () => {
        let result = await chipsDao.makeQuery(INCORRECT_BARCODE, ["bind value 1"]);
        expect(result).to.equal(undefined);
    })

    it('test execute throws an error, result is set to null and error is logged', async () => {
        const consoleStub = sinon.stub(console, 'log');
        let connection = await oracledb.getConnection(config);
        connection.execute.throws(error);
        let result = await chipsDao.makeQuery(INCORRECT_BARCODE, ["bind value 1"]);
        expect(connection.execute).to.have.throw(error);
        expect(result).to.not.equal(undefined);
        expect(result).to.equal(null);
        expect(consoleStub.calledOnce).to.be.true;
    })
});