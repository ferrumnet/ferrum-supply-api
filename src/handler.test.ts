import {handler} from ".";
import {LambdaHttpRequest, LambdaHttpResposne} from "aws-lambda-helper";

test('test totalSupply is provided', async function() {
    jest.setTimeout(100000);
    const req = {
        httpMethod: 'GET',
    } as LambdaHttpRequest;
    const res = await handler(req, {}) as LambdaHttpResposne;
    console.log(res);
    expect(res.statusCode).toBe(200);
    const expectedSupply = 42539167+25768809+11590000
    console.log('EXPECTED', expectedSupply);
});

test('test totalSupply for CMC is provided', async function() {
    jest.setTimeout(100000);
    const req = {
        httpMethod: 'GET',
        queryStringParameters: { cmc: "true" },
    } as LambdaHttpRequest;
    const res = await handler(req, {}) as LambdaHttpResposne;
    console.log(res);
    expect(res.statusCode).toBe(200);
    const expectedSupply = 42539167+25768809+11590000
    console.log('EXPECTED', expectedSupply);
});
