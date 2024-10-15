

const ChangellyBaseAPI = 'https://api.changelly.com';
const ChangellyVersion = 'v2';

const API_KEY = '123';


const changellySign = () => {


    return '456';

}

/**
 * Changelly API 工具
 */

export default {


    //估价兑换
    async getExchangeAmount(from = 'ltc', to = 'eth', amountFrom = '3.99', id = "test") {

        console.warn('ChangellyAPI:#getExchangeAmount');
        let _res = { status: false, msg: '' };

        try {

            let r = await fetch(`${ChangellyBaseAPI}/${ChangellyVersion}/#getExchangeAmount`, {
                method: "POST",
                headers: {
                    'X-Api-Key': "APIKEY",
                    'X-Api-Signature': changellySign()
                },
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "id": id,
                    "method": "getExchangeAmount",
                    "params": {
                        "from": from,
                        "to": to,
                        "amountFrom": amountFrom
                    }
                })
            }).then((res) => res.json());


            if (r.error) {

                _res.msg = `ERROR CODE:${r.error.code},Reason:${r.error.message}`;

            } else {

                _res.status = true;
                _res.data = r.result;

            }

        } catch (e) {

            _res.msg = e instanceof Error ? e.message : JSON.stringify(e);

        }
        return _res;
    },

    //创建交易
    async createTransaction(from = "eth", to = "xrp", xrpAddress = "<<valid xrp address>>", xrpExtraId = "<<valid xrp extraId>>", amountFrom = "0.0339", id = "test") {

        console.warn('ChangellyAPI:#createTransaction');

        let _res = { status: false, msg: '' };

        try {

            let r = await fetch(`${ChangellyBaseAPI}/${ChangellyVersion}/#createTransaction`, {
                method: "POST",
                headers: {
                    'X-Api-Key': "APIKEY",
                    'X-Api-Signature': changellySign()
                },
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "id": id,
                    "method": "createTransaction",
                    "params": {
                        "from": from,
                        "to": to,
                        "address": xrpAddress,
                        "extraId": xrpExtraId,
                        "amountFrom": amountFrom
                    }
                })
            }).then((res) => res.json());


            if (r.error) {

                _res.msg = `ERROR CODE:${r.error.code},Reason:${r.error.message}`;

            } else {

                _res.status = true;
                _res.data = r.result;

            }

        } catch (e) {

            _res.msg = e instanceof Error ? e.message : JSON.stringify(e);

        }
        return _res;


    }

}