import { View } from "react-native";
import { WebView } from 'react-native-webview'

import react, { forwardRef } from "react";


export const __HTML_CONTENT = `

<!DOCTYPE html>
<html> 
<head>
  <title>SIGN</title>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/10.5.13/jsrsasign-all-min.js"></script>
</head>
<body>
</body>
<script>
//临时使用Webview实现Changelly签名方法
//TODO 转换成服务端签名

const privateKeyString = "308204bc020100300d06092a864886f70d0101010500048204a6308204a202010002820101009730040a9558e0495cf472a491719b4d6aaa612979dcc52cdc5e5a393c7fe7ab987a5e875f58d49db85a8cd9604c24bad904c939491ecbebf57eda72b92a4ad79903e71fe8f199b0d03c69c32749ed3fd0573ed99a25f0568002f421227a5798e76076c21c63588e1f335a2d1366f6c8e2b7fc23b5e31b551bf0a6e136305723571dde6d2e20d1a83ccb771adcfccdfc5597fb5adf6e2efdf578312e6c4574001599e98f8bbcf774998025b0037554872d3b070eb8cc3e75ffaf4a424f5f0d5dd28cb02efb858f33e458c36e6efbfd5fd2b7e2e2ca8eb7e6dfd8f83e5a719573fbb786a66eff59501c638fcf09c911c0b643b043f328eb57c56bf5e2bb8dc68f02030100010282010004417a8ed81bc9f479eafad590af56cb024a731b52fad8bed8eec89830aa2f7349e91b1ce46a33b85cd9bc7a0eca491e66271789607a58a65d545668411e17a6d6cca08683d35601cc279a65bf209401e64041a974d55fc35c60b8e822ab855bba1ad509c4f933bcf2d3e4078a65e062ea7213654df16b71f1df65ecc7681e8bc69e7b8ea42df598de528ea925b5888491e5cda29c1353c1e6c5d224589be6b3cb59406c0830c4a4cb5739e7548e1ae4b77b938f4fcc8d54ba965cfc71bc4873a6d9840868343ced1ccd3e695bc0b211e2b2f6ca9bf00d84e6a6dc76a107a21b8fec4eb7f1022cf3e9b88f58d65127e4132187a63260dc1438659f3ac5876b0102818100d3c86065d02de05d5d8b59896f5d6ba429a0ecf864a1c9513f2eec5ad1670b01ced481a7291b9815f90b2a0159e6416a175fd359d0ee2daba6b56d75e63189fba39b4bf02f6284f20a936f78f4a4239fd39e3a4c803dee45514171400ca3bcad495c226249b4fd8657b7e7521e3ba9c6508a1fa98f824992cc51816f2049ef9102818100b6c0dfe6195e9a32922cc604b8a12f35332f4b62afb4a9c739fcfc5dc505238a50819b92d1a5246d0f94731cc7e385bbba8fbbdaa0f2ab252b40bfc45f879360f2b8d170635c4720c021e9942693366c12da9e0b5d7c1a6db07c01e6e5067915036a74c5d948dd7f20dbb0bb30c5625e1d0272e39983523e77d93ae42e63841f02818012a9728d263614b2457ef509de4d5e21de25371c80499d62d26d811853a17fdfcde8fdefcbf889834e29c4aecfcc317176d3d3dcf34339b50980ad3f99643e23757c46c9c8732701e91aaad4fec1c3fdde78efec33d4c13d4c76b6d30d0a14a33476b0f4f647c39b65f967a1ddd62614ba9e214220ca3b4f7b3fa767327231710281806c14df95eef5130ecb826d4e077f54330b657219183f2995a8c6e4ddf41258f5892d4dbbe3feddef1e22b67d93fe0c6e7d245a7e2f67b52e134984e0777aefff8b2d20b86e1af9f9f58758e4047855dc4ebe3a701046c03e94fc920762f594108867a24e0c765a80c0070d9b777994f682039bbcdd625bf693dcc64682e4da130281807bbfbcfc44559e2c0c1ae5ba160b6e89a1b5db7ebfd78adcc45a4f4faa76b28cd17bff2339f7cecec0d518088a70bba7a340ad872c82e7e98e9118ade8d220fd93a791ed16c2256fe2bbefefcb161ef4f2c2bdbf5d77d197355690c7c27ee6bea2992cd7c13ddd2571c743ab45a1bda61f3cb0d90e598ba3c38c03e04c8af57f";

    //获取RN的参数开始签名
    function sign(data){

        const newParams = JSON.parse(data).data;
        const method = JSON.parse(data).method;
        const sig = calculateSignature( JSON.parse(data));
       
        // alert(sig);
        
        //签名完成传回RN,根据method区分不同回传
        if(!!sig){
             window.ReactNativeWebView.postMessage(JSON.stringify({type:method,data:sig}));
        }else{
             window.ReactNativeWebView.postMessage(JSON.stringify({type:'error',data:sig}));
        }
       
    
    }

    //SHA签名
    function calculateSignature(params) {
        try {
       
            const key = new RSAKey();
            key.readPKCS8PrvKeyHex(privateKeyString);
            const sig = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
            sig.init(key);

             // alert(JSON.stringify(params));

            const message = {
                "jsonrpc": "2.0",
                "id": "test",
                "method": "getExchangeAmount",
                "params": params.data
            };

            

            return  hextob64(sig.signString(JSON.stringify(message)));
             

        } catch(e) {


        alert(e)
  
        }

         return "签名失败:";
    }





</script>
</html>


`
/**
 * //TODO 将来需要移除 | Changelly签名工具
 */


const SignUtils = forwardRef((props, ref) => {
    return (<View style={{ height: 2, width: 2 }}>
        <WebView ref={ref} onMessage={props.onMessage} source={{ html: __HTML_CONTENT }}
            style={{ flex: 1 }} />
    </View>)
})

export default SignUtils;