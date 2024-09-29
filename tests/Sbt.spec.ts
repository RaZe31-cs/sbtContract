import { Blockchain, SandboxContract, TreasuryContract, printTransactionFees } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Sbt } from '../wrappers/Sbt';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Sbt', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Sbt');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let sbt: SandboxContract<Sbt>;
    let collection: SandboxContract<TreasuryContract>;
    let owner: SandboxContract<TreasuryContract>;
    let authority: SandboxContract<TreasuryContract>;


    beforeEach(async () => {
        blockchain = await Blockchain.create();
        collection = await blockchain.treasury('collection');
        owner = await blockchain.treasury('owner');
        authority = await blockchain.treasury('authority');



        sbt = blockchain.openContract(Sbt.createFromConfig({
            collection: collection.address,
            owner: owner.address,
            authority: authority.address,
        }, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await sbt.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: sbt.address,
            deploy: true,
            success: true,
        });
    });

    it('test thread from dict', async () => {
        expect(await sbt.getThread()).not.toBeNull();
    });

    it('test telegram from dict', async () => {
        expect(await sbt.getTelegram()).not.toBeNull();
    });

    it('change description', async () => {
        const newDescription = 'Новое описание!!';
        const oldDescription = await sbt.getDescription();
        await sbt.sendChangeDescription(owner.getSender(), toNano('0.05'), newDescription);
        expect(await sbt.getDescription()).toBe(newDescription);
        expect(await sbt.getDescription()).not.toBe(oldDescription);
    });
});
