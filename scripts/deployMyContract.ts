import { toNano } from 'ton-core';
import { MyContract } from '../wrappers/MyContract';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const myContract = provider.open(await MyContract.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await myContract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(myContract.address);

    console.log('ID', await myContract.getId());
}
