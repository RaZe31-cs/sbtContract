import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';
import { buildOnchainMetadata } from '../scripts/createOnchainMetaData'

export type SbtConfig = {
    collection: Address;
    owner: Address;
    authority: Address;
};

export function sbtConfigToCell(config: SbtConfig): Cell {
    return beginCell()
    .storeUint(0, 64)
    .storeAddress(config.collection)
    .storeAddress(config.owner)
    .storeRef(buildOnchainMetadata({thread: "3", telegram: "https://t.me/gdeya111", description: "poop"}))
    .storeAddress(config.authority)
    .storeUint(0, 64)
    .endCell();
}

export class Sbt implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Sbt(address);
    }

    static createFromConfig(config: SbtConfig, code: Cell, workchain = 0) {
        const data = sbtConfigToCell(config);
        const init = { code, data };
        return new Sbt(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
            .storeUint(0, 64)
            .storeAddress(Address.parse('UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ'))
            .storeAddress(Address.parse('UQAvYfgU56WI3g46GQ3U8LnIT3tCXNG_hTVF6ehQf5KVhdIq'))
            .storeRef(buildOnchainMetadata({thread: "0", telegram: "https://t.me/gdeya111", description: "test"}))
            .storeAddress(Address.parse('UQAvYfgU56WI3g46GQ3U8LnIT3tCXNG_hTVF6ehQf5KVhdIq'))
            .storeUint(0, 64)
            .endCell(),
        });
    }

    async getThread(provider: ContractProvider) {
        const res = (await provider.get('get_thread', [])).stack
        return res.readString();
    }

    async getTelegram(provider: ContractProvider) {
        const res = (await provider.get('get_telegram', [])).stack
        return res.readString();
    }

    async getDescription(provider: ContractProvider) {
        const res = (await provider.get('get_description', [])).stack
        return res.readString();
    }

    async sendChangeDescription(provider: ContractProvider, via: Sender, value: bigint, newDesc: string) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x7587fb7c, 32).storeUint(0, 64).storeStringTail(newDesc).endCell(),
        });
    }
}
