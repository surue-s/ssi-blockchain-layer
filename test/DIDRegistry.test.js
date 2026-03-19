const { expect } = require("chai");

describe("DIDRegistry", function () {
    let didRegistry;
    let owner;

    beforeEach(async function () {
        const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
        didRegistry = await DIDRegistry.deploy();
        [owner] = await ethers.getSigners();
    });

    it("Should register a DID", async function () {
        const did = "did:polygon:amoy:user123";
        const data = "test_data";
        
        await didRegistry.registerDID(did, data);
        const result = await didRegistry.getDID(did);
        
        expect(result).to.equal(data);
    });
});