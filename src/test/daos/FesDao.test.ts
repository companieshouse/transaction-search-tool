import { expect } from 'chai';
import { describe } from 'mocha';
import sinon from 'sinon';
import oracledb from 'oracledb';
import FesDao from '../../daos/FES/FesDao';

const config = {
    user: "USER",
    password: "PASSWORD",
    connectionString: "CONSTRING"
};

//Test both string and number return
const DATA = {
    "XXXX1234": { form_id: 1, form_status: 1, returned_reason: "Not Returned" }
}

const CORRECT_BARCODE = "XXXX1234";
const INCORRECT_BARCODE = "YYYY1234";

const fesDao = new FesDao();
const error = new Error('test error');
  
describe('Fes database call', () => {
    before( async ()=> {
        sinon.stub(oracledb, 'getConnection').resolves({
            execute: function() {},
            close: function() {}
        });
        let connection = await oracledb.getConnection(config);
        connection.execute = sinon.stub();
        connection.execute.withArgs(CORRECT_BARCODE).resolves({
            rows: {"XXXX1234": { form_id: 1, form_status: 1, returned_reason: "Not Returned" }}
        });
    })
    after(()=> {
        oracledb.getConnection.restore();
    })

    it('test makeQuery returns data when correct barcode is provided', async () => {
        let result = await fesDao.makeQuery(CORRECT_BARCODE, ["bind value 1"]);
        expect(result.rows[CORRECT_BARCODE]).to.deep.equal(DATA[CORRECT_BARCODE]);
    })

    it('test makeQuery returns empty when incorrect barcode is provided', async () => {
        let result = await fesDao.makeQuery(INCORRECT_BARCODE, ["bind value 1"]);
        expect(result).to.equal(undefined);
    })

    it('test execute throws an error, result is set to null', async () => {

        let connection = await oracledb.getConnection(config);
        connection.execute.throws(error);
        let result = await fesDao.makeQuery(INCORRECT_BARCODE, ["bind value 1"]);
        expect(connection.execute).to.have.throw(error);
        expect(result).to.not.equal(undefined);
        expect(result).to.equal(null);
    })
});