import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';
import { ADNLAddress } from 'ton-core';
import { buildOnchainMetadata } from '../scripts/createOnchainMetaData';
import { compile } from '@ton/blueprint';

export type SbtCollectionConfig = {
    owner_address: Address,
    next_item_index: number,
    content: Cell,
    nft_item_code: Cell,
    royalty_params: Cell,
    second_owner: Address

}
;

export function sbtCollectionConfigToCell(config: SbtCollectionConfig): Cell {
    return beginCell().endCell();
}

export class SbtCollection implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new SbtCollection(address);
    }

    static createFromConfig(config: SbtCollectionConfig, code: Cell, workchain = 0) {
        const data = sbtCollectionConfigToCell(config);
        const init = { code, data };
        return new SbtCollection(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint, owner: Address, content: Cell, nft_item_code: Cell, royalty_params: Cell) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeAddress(owner).storeUint(0, 64).storeRef(content).storeRef(nft_item_code).storeRef(royalty_params).storeAddress(owner).endCell(),
            },
        )}

    async sendDeployNft(provider: ContractProvider, via: Sender, value: bigint, item_index: bigint, amount: bigint, content: Cell) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(1, 64).storeUint(0, 64).storeUint(item_index, 64).storeCoins(amount).storeRef(content).endCell(),
        });
    }
}
