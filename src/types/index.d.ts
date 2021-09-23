import BN from 'bn.js'
import { ReactNode } from 'react'
import { Connectors } from '@/types/constants'

export * from './forms'
export * from './data'
export { User } from '@/store/auth/auth.interface'

export type Unit8 = number | string | BN
export type Unit256 = number | string | BN
export type Files = File[]

export interface IProps {
  [propName: string]: any
}

export interface IResponse {
  status: boolean
  message: string
  [propName: string]: any
}

export interface IModel {
  id: number
  createdAt: Date | string
  updatedAt: Date | string
}

export interface IPaginate<T = any[]> {
  docs: T
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface SelectOption {
  label: string
  value: any
}

export interface WalletConnectors {
  id: number
  name: string
  icon: string
  connector: Connectors
}

export interface DialogOptions {
  type?: 'alert' | 'confirm'
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  resolvePromise?: (value: DialogResults | PromiseLike<DialogResults>) => void
  rejectPromise?: (reason?: any) => void
}

export interface DialogResults {
  isConfirmed: boolean
  isDenied: boolean
}

export interface DialogMessage {
  [key: string]: string[]
}

export interface ModalOptions {
  title?: string
  component: ReactNode
}

export interface StorageProps {
  get: (key: string) => string | null | void
  set: (key: string, input: any) => void
  remove: (key: string) => void
}

export interface FileValidatorOptions {
  /**
   * Extension type e.g. `jpg`, `mp4`
   */
  fileType?: FileValidation

  /**
   * MIME Type e.g. `image`, `video`
   */
  fileMimeType?: FileValidation

  /**
   * Unit megabyte/file `MB`
   */
  fileMaxSize?: FileValidation
}

export interface FileValidation {
  regex: any
  message: string
}
