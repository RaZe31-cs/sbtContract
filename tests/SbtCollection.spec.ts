import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { SbtCollection } from '../wrappers/SbtCollection';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('SbtCollection', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('SbtCollection');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let sbtCollection: SandboxContract<SbtCollection>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        sbtCollection = blockchain.openContract(SbtCollection.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await sbtCollection.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: sbtCollection.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and sbtCollection are ready to use
    });
});
