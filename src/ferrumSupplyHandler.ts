// Implement your specific handlers in a separate file
import {LambdaHttpHandler} from "aws-lambda-helper/dist/HandlerFactory";
import {LambdaHttpRequest, LambdaHttpResposne} from "aws-lambda-helper";
import {ChainClientFactory, Erc20ReaderClient} from "ferrum-chain-client";

const LOCKED_ADDRESSES = {
    ETHEREUM: [
        '0xc2fdcb728170192c72ada2c08957f2e9390076b7', // Contract creator contract address
        '0x58982F95A51dbCBc758CAB9620bDa77A8e93b9C3', // Token swap pool
    ]
    ,
    BINANCE: [
        'bnb1um8ntkgwle8yrdk0yn5hwdf7hckjpyjjg29k2p', // Token creator address
        'bnb1h8dg2vddxgj2qarvs0cxhauk5ucgnftrddlw7d', // Token swap pool BNB
    ]
};

export class FerrumSupplyHandler implements LambdaHttpHandler {
    constructor(private readonly chainClient: ChainClientFactory,
                private readonly erc20: Erc20ReaderClient) {
    }

    async handle(request: LambdaHttpRequest, context: any): Promise<LambdaHttpResposne> {
        const binClient = this.chainClient.forNetwork('BINANCE');
        const totalSupplyP = this.erc20.totalSupply();
        const ethBalancesP = LOCKED_ADDRESSES.ETHEREUM.map(a => this.erc20.balanceOf(a));
        const bnbBalancesP = LOCKED_ADDRESSES.BINANCE.map(a => binClient.getBalance(a, 'FRM-DE7'));
        const totalSupply = await totalSupplyP;
        const ethBalances = await Promise.all(ethBalancesP);
        const bnbBalances = await Promise.all(bnbBalancesP);
        const ethSupply = totalSupply - ethBalances.reduce((p: number, c?: number) => p + (c || 0), 0);
        const bnbSupply = totalSupply - bnbBalances.reduce((p: number, c?: number) => p + (c || 0), 0);
        const liquidSupply = ethSupply + bnbSupply;

        return {
            body: liquidSupply.toFixed(12),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/html',
            },
            statusCode: 200,
        } as LambdaHttpResposne
    }
}
