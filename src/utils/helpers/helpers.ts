export const ipfsGatewayReplace = (url: string) => {
  // console.log('url: ' + url)
  return url.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/')
}
