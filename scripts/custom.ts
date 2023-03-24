import { NetworkProvider, sleep } from '@ton-community/blueprint';
import { Address, toNano } from 'ton-core';
import { MyContract } from '../wrappers/MyContract';

const counterAddress = 'EQCS9Y4JHLZUuNXy-nH4heGSZtVk2qGs4T-tfTiKASe4bDBJ';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const parsedAddress = Address.parse(counterAddress);
    const counter = provider.open(MyContract.fromAddress(parsedAddress));

    const counterBefore = await counter.getCounter();

    ui.write(`got counter before: ${counterBefore}`);

    await counter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Add',
            queryId: 0n,
            amount: 100n,
        }
    );

    let counterAfter = counterBefore;

    while (counterAfter === counterBefore) {
        counterAfter = await counter.getCounter();
        ui.write(`after::${counterAfter}, before::${counterBefore}`);
        await sleep(2000);
    }

    ui.write(`Counter increased successfully! Old value: ${counterBefore}, new value: ${counterAfter}`);
}
