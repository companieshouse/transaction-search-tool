import { expect } from 'chai';
import { describe } from 'mocha';
import sinon from 'sinon';
import oracledb from 'oracledb';
import StaffwareDao from '../../daos/staffware/StaffwareDao';

const config = {
    user: "USER",
    password: "PASSWORD",
    connectionString: "CONSTRING"
};

const DATA = {
    "2011111": { orgunit_desc: "ORG UNIT DESC" }
}

const CORRECT_DOC_ID = "2011111";
const INCORRECT_DOC_ID = "12345";

const swDao = new StaffwareDao();
const error = new Error('test error');
  
describe('Staffware database call', () => {
    before( async ()=> {
        sinon.stub(oracledb, 'getConnection').resolves({
            execute: function() {},
            close: function() {}
        });
        let connection = await oracledb.getConnection(config);
        connection.execute = sinon.stub();
        connection.execute.withArgs(CORRECT_DOC_ID).resolves({
            rows: {"2011111": { orgunit_desc: "ORG UNIT DESC" }}
        });
    })
    after(()=> {
        oracledb.getConnection.restore();
    })

    it('test makeQuery returns data when correct barcode is provided', async () => {
        let result = await swDao.makeQuery(CORRECT_DOC_ID, ['docu']);
        expect(result.rows[CORRECT_DOC_ID]).to.deep.equal(DATA[CORRECT_DOC_ID]);
    })

    it('test makeQuery returns empty when incorrect barcode is provided', async () => {
        let result = await swDao.makeQuery(INCORRECT_DOC_ID, ['docu']);
        expect(result).to.equal(undefined);
    })

    it('test execute throws an error, result is set to null', async () => {

        let connection = await oracledb.getConnection(config);
        connection.execute.throws(error);
        let result = await swDao.makeQuery(INCORRECT_DOC_ID, ['docu']);
        expect(connection.execute).to.have.throw(error);
        expect(result).to.not.equal(undefined);
        expect(result).to.equal(null);
    })
});