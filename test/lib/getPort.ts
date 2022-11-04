import net, { AddressInfo, ListenOptions } from "net";

export interface GetPortOptions extends Omit<ListenOptions, "port"> {}

export default async function (options?: GetPortOptions): Promise<number> {
    return await new Promise((resolve, reject) => {
        const server = net.createServer();
        server.unref();
        server.on("error", reject);
        server.listen({ ...options, port: 0 }, () => {
            const { port } = server.address() as AddressInfo;
            server.close(() => {
                resolve(port);
            });
        });
    });
}
