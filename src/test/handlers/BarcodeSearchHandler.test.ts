import chai from 'chai';
import ChipsService from '../../service/ChipsService';
import sinon from 'sinon';
import BarcodeSearchHandler from '../../handlers/BarcodeSearchHandler';
import StaffwareService from '../../service/StaffwareService';
import ChipsResult from '../../data/ChipsResult';
import StaffwareResult from '../../data/StaffwareResult';
import FesService from '../../service/FesService';
import FesResult from '../../data/FesResult';
import DocumentOverviewModel from '../../models/DocumentOverviewModel';
import TimelineModel from '../../models/TimelineModel';

import sinon_chai from 'sinon-chai';
chai.use(sinon_chai);

describe('barcode search handler', ()=>{

    let barcodeSearchHandler:BarcodeSearchHandler;

    before(()=>{

        barcodeSearchHandler = new BarcodeSearchHandler();

        const chipsService = new ChipsService();
        const swService = new StaffwareService();

        const chipsResult = new ChipsResult();
        chipsResult.transactionId = 1;
        chipsResult.incorporationNumber = "inco";
        chipsResult.documentId = 1;
        chipsResult.chipsStatus = "Pending";
        chipsResult.transactionDate = "01/12/2020";

        const staffwareResult = new StaffwareResult();
        staffwareResult.orgUnitId = 1234;
        staffwareResult.userId = 1;
        staffwareResult.casenum = "11439511";
        staffwareResult.date = "09-NOV-2021 11:21";

        sinon.stub(chipsService, 'getTransactionDetailsFromBarcode').resolves(chipsResult);
        orgUnitStub = sinon.stub(chipsService, 'getOrgUnitFromId').resolves("My Org Unit");
        userStub = sinon.stub(chipsService, 'getUserFromId').resolves("Test User");
        barcodeSearchHandler.chipsService = chipsService;

        sinon.stub(swService, 'addStaffwareData').resolves(staffwareResult);
        sinon.stub(swService, 'getAuditDate').resolves(staffwareResult);
        barcodeSearchHandler.swService = swService;
    })

    it('test barcodeSearch returns expected DocumentOverviewModel when called', async ()=>{

        const fesService = new FesService();

        const fesResult = new FesResult();
        fesResult.envNo = 1;
        fesResult.scanTime = "01/12/2020";
        fesResult.formType = "IN01";
        fesResult.fesStatus = "Sent to CHIPS";
        fesResult.icoReturnedReason = "Not Returned";
        fesResult.icoAction = "No Action Required";
        fesResult.eventOccurredTime = "No exception occurred";
        fesResult.eventText = "No exception occurred";
        fesResult.batchName = "Batch Name";

        sinon.stub(fesService, 'getTransactionDetailsFromBarcode').resolves(fesResult);
        barcodeSearchHandler.fesService = fesService;

        const model = new DocumentOverviewModel();
        model.formBarcode = "XYZ123456";
        model.transactionId = 1;
        model.incorporationNumber = "inco";
        model.status = "Pending";
        model.documentId = 1;
        model.envNo = 1;
        model.batchName = "Batch Name";
        model.scanTime = "01/12/2020";
        model.icoReturnedReason = "Not Returned";
        model.icoAction = "No Action Required";
        model.eventOccurredTime = "No exception occurred";
        model.eventText = "No exception occurred";
        model.transactionDate = "01/12/2020";
        model.chipsStatus = "Pending";
        model.fesStatus = "Sent to CHIPS";
        model.orgUnit = "My Org Unit";
        model.formType = "IN01";
        model.userLogin = "Test User";
        model.casenum = "11439511";

        const result = await barcodeSearchHandler.searchBarcode('XYZ123456');
        chai.expect(result).to.be.deep.equal(model);
    }).timeout(5000)

    it('test barcodeSearch returns expected timelineModel when called', async ()=>{

        const fesResult2 = new FesResult();
        fesResult2.eventOccurredTime = "09-NOV-2021 11:21";
        fesResult2.eventText = "Scanning";
        fesResult2.location = "Fes";
        fesResult2.userLogin = "sbowen";

        const fesTimelineResult : FesResult[] = [fesResult2];

        const fesService = new FesService();

        sinon.stub(fesService, 'getFesTimelineDetails').resolves(fesTimelineResult);
        barcodeSearchHandler.fesService = fesService;

        const model = new TimelineModel();
        model.date = "09-NOV-2021 11:21";
        model.event = "Scanning";
        model.location = "Staffware";
        model.userLogin = "sbowen";

        const docModel = new DocumentOverviewModel();
        docModel.transactionDate = "09-NOV-2021 11:21";
        docModel.chipsStatus = "Scanning";
        docModel.orgUnit = "FES";
        docModel.userLogin = "sbowen";
        docModel.transactionId = 1;
        docModel.casenum = "11439511";

        const expectedArray = [{
            "date" : "09 NOV 2021 at 11:21",
            "event" : "Scanning",
            "location" : "FES",
            "userLogin" : "sbowen"
        }, {
            "date" : "09 NOV 2021 at 11:21",
            "event" : "Scanning",
            "location" : "FES",
            "userLogin" : "sbowen"
        }, {
            "date" : "09 NOV 2021 at 11:21",
            "event" : "Arrived in Staffware",
            "location" : "Staffware",
            "userLogin" : "User"
        }];

        const result = await barcodeSearchHandler.getTimelineResult('XYZ123456', docModel);
        chai.expect(result).to.be.deep.equal(expectedArray);
    }).timeout(5000)
})
