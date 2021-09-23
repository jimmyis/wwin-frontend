import { create } from 'ipfs-http-client'
import { createObjectURL } from '@/utils'

export interface Preview {
  url: string
  isImage: boolean
  isVideo: boolean
  isAudio: boolean
}

export async function getMediaBlob(input: string | Blob | File): Promise<Preview> {
  if (typeof input === 'string') {
    const res = await fetch(input).then((r) => r.blob())
    return {
      url: createObjectURL(res),
      isImage: isImage(res.type),
      isVideo: isVideo(res.type),
      isAudio: isAudio(res.type)
    }
  } else {
    return {
      url: createObjectURL(input),
      isImage: isImage(input.type),
      isVideo: isVideo(input.type),
      isAudio: isAudio(input.type)
    }
  }
}

export function isImage(value: string): boolean {
  return value.includes('image')
}

export function isVideo(value: string): boolean {
  return value.includes('video')
}

export function isAudio(value: string): boolean {
  return value.includes('audio')
}

export function createFormData(data: { [key: string]: any }): [FormData, any] {
  const formData = new FormData()

  for (const name in data) {
    formData.append(name, data[name])
  }

  return [
    formData,
    {
      'Content-Type': 'multipart/form-data'
    }
  ]
}

/**
 * GET File from list.
 *
 * @param {object} files FileList
 * @param {number} at Index of list
 */
export function getFileListAt(files: FileList, at: number = 0): File | null {
  if (files instanceof FileList) {
    return files.item(at)
  }

  return null
}

/**
 * UPLOAD file to IPFS,
 *
 * @param {File} file
 */
export async function uploadToIPFS(file: File): Promise<string> {
  const client = create({
    protocol: 'https',
    host: 'ipfs.infura.io',
    port: 5001,
    apiPath: 'api/v0'
  })

  const fileName = file.name.toString()
  const res = await client.add({
    path: fileName,
    content: file
  })

  return `${res.cid.toString()}?filename=${res.path}`
}

export function getIpfs(token: string): string {
  return `https://ipfs.io/ipfs/${token}`
}
