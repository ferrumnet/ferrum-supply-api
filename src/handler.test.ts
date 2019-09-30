import {handler} from ".";
import {LambdaHttpRequest, LambdaHttpResposne} from "aws-lambda-helper";

test('test totalSupply is provided', async () => {
    const req = {
        queryStringParameters: { 'message': 'testing' },
        httpMethod: 'GET',
    } as LambdaHttpRequest;
    const res = await handler(req, {}) as LambdaHttpResposne;
    console.log(res);
    expect(res.statusCode).toBe(200);
    const expectedSupply = 42539167+25768809+11590000
    console.log('EXPECTED', expectedSupply);
});
