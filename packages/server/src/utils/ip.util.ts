// eslint-disable-next-line @typescript-eslint/no-var-requires
const ipSearcher = require('node-ip2region').create();

export function getClientIP(req) {
  const ip =
    req.headers['x-real-ip'] ||
    // Determine whether there is a reverse proxy IP
    req.headers['x-forwarded-for'] ||
    // Determine the remote location of connection IP
    (req.connection && req.connection.remoteAddress) ||
    // Determine the IP of the backend socket
    (req.socket && req.socket.remoteAddress) ||
    (req.connection && req.connection.socket && req.connection.socket.remoteAddress);

  return ip ? ip.split(':').pop() : '';
}

export function parseIp(ip) {
  try {
    const { region } = ipSearcher.btreeSearchSync(ip);
    const normalized = (value: string) => {
      if (value === '内网IP') {
        return 'Private Network IP';
      }
      return value;
    };

    return region
      .split('|')
      .filter((d) => +d !== 0)
      .map((d) => normalized(d))
      .filter((d, index, arr) => d && arr.indexOf(d) === index)
      .join(' ');
  } catch (e) {
    return '';
  }
}
