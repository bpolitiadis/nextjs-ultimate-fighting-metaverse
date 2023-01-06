import * as fs from 'fs'
import pinataSDK from '@pinata/sdk'

const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || ''
const pinataApiSecret = process.env.NEXT_PUBLIC_PINATA_SECRET_API_SECRET || ''
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

export async function storeImage(imageURI: string) {
  try {
    const response = await pinata.pinFileToIPFS(imageURI)
    console.log('response', response)
    return response
  } catch (error) {
    console.log(error)
  }
}

export async function storeTokeUriMetadata(metadata: Object) {
  try {
    const response = await pinata.pinJSONToIPFS(metadata)
    return response
  } catch (error) {
    console.log(error)
  }
  return null
}
