import {Container, LambdaGlobalContext, LambdaHttpRequest, LambdaHttpResposne, Module} from "aws-lambda-helper/dist";
import {LambdaHttpHandler} from "aws-lambda-helper/dist/HandlerFactory";
import {
    BinanceGasPriceProvider,
    ChainClientFactory,
    CreateNewAddressFactory, Erc20ReaderClient, EthereumClient,
    EthereumGasPriceProvider
} from "ferrum-chain-client";
import {CHAIN_CONFIG} from "./Config";
import {FerrumSupplyHandler} from "./ferrumSupplyHandler";

// Once registered this is the handler code for lambda_template
export async function handler(event: any, context: any) {
    const container = await LambdaGlobalContext.container();

    await container.registerModule(new MyLambdaModule()); // Change this to your defined module

    const lgc = container.get<LambdaGlobalContext>(LambdaGlobalContext);
    return await lgc.handleAsync(event, context);
}

export class MyLambdaModule implements Module {
    async configAsync(container: Container) {
        container.register(CreateNewAddressFactory, () => new Object());
        container.registerSingleton(EthereumGasPriceProvider, () => new EthereumGasPriceProvider());
        container.register(ChainClientFactory, c => new ChainClientFactory(
            CHAIN_CONFIG, new BinanceGasPriceProvider(), c.get(EthereumGasPriceProvider),
            c.get(CreateNewAddressFactory)
        ));
        container.register('Erc20ReaderClient', c => new Erc20ReaderClient(
            c.get<ChainClientFactory>(ChainClientFactory).forNetwork('ETHEREUM') as EthereumClient,
            CHAIN_CONFIG.contractAddresses['FRM']));
        container.register('LambdaSqsHandler', c => new Object());
        container.register('LambdaHttpHandler', c => new FerrumSupplyHandler(
            c.get(ChainClientFactory),
            c.get('Erc20ReaderClient'),
        ));
    }
}
