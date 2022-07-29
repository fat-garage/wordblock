import _getPort from 'get-port';

export default async function getPort(host: string, port: number): Promise<number> {
  const result = await _getPort({ host, port });
  if (result === port) {
    return result;
  }
  return getPort(host, port + 1);
}
