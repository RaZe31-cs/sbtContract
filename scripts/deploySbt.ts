import { toNano } from '@ton/core';
import { Sbt } from '../wrappers/Sbt';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const sbt = provider.open(Sbt.createFromConfig({
        collection: provider.sender().address!,
        owner: provider.sender().address!,
        authority: provider.sender().address!,
    }, await compile('Sbt')));

    await sbt.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(sbt.address);

    // run methods on `sbt`
}
