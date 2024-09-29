import { Address, beginCell, toNano } from '@ton/core';
import { SbtCollection } from '../wrappers/SbtCollection';
import { Sbt } from '../wrappers/Sbt';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './createOnchainMetaData'


export async function run(provider: NetworkProvider) {
    const sbtCollection = provider.open(SbtCollection.createFromConfig({
        owner_address: provider.sender().address!,
        // owner_address: provider.sender().address!,
        next_item_index: 0,
        content: buildOnchainMetadata({
                "image": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/image.png",
                "name": "TON Smart Challenge #2",
                "description": "TON Smart Challenge #2 Winners Trophy",
                "social_links": [],
                "marketplace": "getgems.io"
            }),
        nft_item_code: await compile('Sbt'),
        royalty_params: beginCell().
            storeUint(11, 16).
            storeUint(1000, 16).
            storeAddress(provider.sender().address!).
            endCell(),
        second_owner: provider.sender().address!,
    }, await compile('SbtCollection')));

    await sbtCollection.sendDeploy(provider.sender(), 
    toNano('0.05'), 
    Address.parse('UQAvYfgU56WI3g46GQ3U8LnIT3tCXNG_hTVF6ehQf5KVhdIq'),
    buildOnchainMetadata({thread: "0", telegram: "https://t.me/666", description: "test"}),
    await compile('Sbt'),
    beginCell()
    .storeUint(11, 16)
    .storeUint(1000, 16)
    .storeAddress(provider.sender().address!)
    .endCell());

    await provider.waitForDeploy(sbtCollection.address);


}
