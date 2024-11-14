
const API_KEY = 'iY91jULmC+d7AFNCB8ZcBJ3TOqYTklB9IcbU2indKQg=';
const ChangellyBaseAPI = 'https://api.changelly.com';
const ChangellyVersion = 'v2';

/**
 * Changelly API 工具
 */

export default {


    //估价兑换
    async getExchangeAmount(from = 'ltc', to = 'eth', amountFrom = '3.99', sign) {

        console.log('ChangellyAPI:#getExchangeAmount');
        let _res = { status: false, msg: '' };

        const params = {
            "jsonrpc": "2.0",
            "id": "test",
            "method": "getExchangeAmount",
            "params": {
                "from": from.toLowerCase(),
                "to": to.toLowerCase(),
                "amountFrom": amountFrom.toString()
            }
        }
        try {

            let r = await fetch(`${ChangellyBaseAPI}/${ChangellyVersion}/#getExchangeAmount`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', 'x-api-key': API_KEY,
                    'x-api-signature': sign
                },
                body: JSON.stringify(params)
            }).then(async (res) => {

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const rs = await res.json()
                if (rs.error) {
                    throw new Error('API ERROR:货币转换不支持:' + rs.error.message)
                } else {
                    return rs;
                }

            }).catch((er) => {
                _res.msg = `ERROR CODE:${er.code},Reason:${er.message}`;
                console.error(er);
            });

            _res.status = true;
            _res.data = r.result;

        } catch (e) {

            _res.msg = e instanceof Error ? e.message : JSON.stringify(e);

        }
        return _res;
    },

    //创建交易
    async createTransaction(from = "eth", to = "xrp", xrpAddress = "<<valid xrp address>>", xrpExtraId = "<<valid xrp extraId>>", amountFrom = "0.0339", sign = '') {

        console.log('ChangellyAPI:#createTransaction');

        let _res = { status: false, msg: '' };
        const params = {
            "jsonrpc": "2.0",
            "id": id,
            "method": "createTransaction",
            "params": {
                "from": from.toLowerCase(),
                "to": to.toLowerCase(),
                "address": xrpAddress,
                "extraId": xrpExtraId,
                "amountFrom": amountFrom.toString()
            }
        };



        try {

            let r = await fetch(`${ChangellyBaseAPI}/${ChangellyVersion}/#createTransaction`, {
                method: "POST",
                headers: {
                    'X-Api-Key': API_KEY,
                    'X-Api-Signature': sign
                },
                body: JSON.stringify(params)
            }).then(async (res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const rs = await res.json()
                if (rs.error) {
                    throw new Error('API ERROR:货币转换不支持:' + rs.error.message)
                } else {
                    return rs;
                }
            });

            _res.status = true;
            _res.data = r.result;
        } catch (e) {

            _res.msg = e instanceof Error ? e.message : JSON.stringify(e);

        }
        return _res;


    }

}