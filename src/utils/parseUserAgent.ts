import  parser from 'ua-parser-js';
export default function parseUserAgent(userAgent: string) {
  const parsedInfo = parser(userAgent);
  

  return {
    browser: parsedInfo.browser.name,
    os: parsedInfo.os.name,
    device: parsedInfo.device.model,
    userAgent: userAgent,
  };
}
