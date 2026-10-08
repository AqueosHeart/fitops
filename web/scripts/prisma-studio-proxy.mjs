import http from "node:http";
import net from "node:net";

const upstreamHost = "127.0.0.1";
const upstreamPort = 5555;
const proxyPort = 5556;

const server = http.createServer((clientRequest, clientResponse) => {
  const headers = { ...clientRequest.headers, host: `${upstreamHost}:${upstreamPort}` };
  delete headers["proxy-connection"];

  const upstreamRequest = http.request(
    {
      hostname: upstreamHost,
      port: upstreamPort,
      method: clientRequest.method,
      path: clientRequest.url,
      headers,
    },
    (upstreamResponse) => {
      clientResponse.writeHead(
        upstreamResponse.statusCode ?? 502,
        upstreamResponse.statusMessage,
        upstreamResponse.headers,
      );
      upstreamResponse.pipe(clientResponse);
    },
  );

  upstreamRequest.on("error", () => {
    if (!clientResponse.headersSent) clientResponse.writeHead(502);
    clientResponse.end("Prisma Studio is not ready.");
  });

  clientRequest.pipe(upstreamRequest);
});

server.on("upgrade", (clientRequest, clientSocket, head) => {
  const upstreamSocket = net.connect(upstreamPort, upstreamHost, () => {
    const headers = Object.entries(clientRequest.headers)
      .map(([name, value]) => `${name}: ${name.toLowerCase() === "host" ? `${upstreamHost}:${upstreamPort}` : value}`)
      .join("\r\n");
    upstreamSocket.write(`${clientRequest.method} ${clientRequest.url} HTTP/${clientRequest.httpVersion}\r\n${headers}\r\n\r\n`);
    if (head.length > 0) upstreamSocket.write(head);
    upstreamSocket.pipe(clientSocket);
    clientSocket.pipe(upstreamSocket);
  });

  upstreamSocket.on("error", () => {
    clientSocket.end("HTTP/1.1 502 Bad Gateway\r\nConnection: close\r\n\r\n");
  });
  clientSocket.on("error", () => upstreamSocket.destroy());
});

server.listen(proxyPort, "0.0.0.0");
