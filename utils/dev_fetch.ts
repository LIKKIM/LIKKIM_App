import { ApiMonitorStats, FloatingDev } from "./dev";

/**
 * @author will
 * 全局fetch修改：开发模式使用
 * 由于项目fetch使用太分散，并且fetch不支持拦截器，所以这里是临时修改统一获取全部fetch数据，会存在部分问题。
 * 最好是使用最好是直接调用 FloatingDev.api.addRecord在需要的地方记录。
 */
const originalFetch = global.fetch;

global.fetch = async (input, init) => {
  try {
    const response = await originalFetch(input, init);

    const responseCloneForData = response.clone();
    const responseCloneForReturn = response.clone();

    let data;
    try {
      data = await responseCloneForData.json();
    } catch (e) {
      try {
        data = await responseCloneForData.text();
      } catch (e2) {
        data = '[Unparsable response]';
      }
    }

    if (__DEV__) {
      const url = typeof input === 'string' ? input : input.url;
      const method = init?.method || 'GET';

      const shouldMonitor = (await FloatingDev.api.getMonitorApiList()) as ApiMonitorStats[];
      const match = shouldMonitor.some((api) => url.includes(api.url));

      if (match) {
        FloatingDev.api.addRecord({
          time: new Date().toISOString(),
          url,
          name: method,
          response: typeof data === 'string' ? data : JSON.stringify(data),
          timestamp: new Date().toISOString(),
          method,
          status: response.status,
        });
      }
    }

    return responseCloneForReturn; // 返回 clone 避免主 app fetch 获取已消费 response
  } catch (error) {
    console.log('Global:fetch error', error);
    throw error;
  }
};