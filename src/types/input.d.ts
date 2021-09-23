import { ReactNode } from 'react'
import { FieldError, UseFormRegister, RegisterOptions } from 'react-hook-form'

export interface INPUTAttributes {
  key: string
  vid?: string
  name: string
  label: string
  icon?: string
  register: UseFormRegister
  errors?: FieldError | FieldError[]
  rules?: RegisterOptions
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  children?: ReactNode
}

export interface InputProps extends INPUTAttributes {
  type?: 'text' | 'number' | 'search' | 'email' | 'password' | 'date' | 'time' | 'datetime-local'
  value?: string | number | readonly string[]
  autofocus?: boolean
  autocomplete?: string
  placeholder?: string
  maxlength?: number
}

export interface TextareaProps extends INPUTAttributes {
  value?: string | number | readonly string[]
  rows?: number
  placeholder?: string
  maxlength?: number
}

export interface SelectProps extends INPUTAttributes {
  value?: string | number | readonly string[]
  placeholder?: string
  options: OptionProps[]
  optionValue?: string
  optionLabel?: string
  optionGroup?: string[]
}

export interface RadioProps extends INPUTAttributes {
  value?: string | number
  placeholder?: string
  options: OptionProps[]
  optionValue?: string
  optionLabel?: string
}

export interface OptionProps {
  label: string
  value: string
}

export interface CheckboxProps extends INPUTAttributes {
  value?: boolean
}

export interface ImageProps extends INPUTAttributes {
  value?: FileList | File[] | string
}

export interface MediaProps extends INPUTAttributes {
  value?: FileList | File[] | string
  multiple?: boolean
  accept?: string
}

export interface TagsProps extends INPUTAttributes {
  value?: string[]
  onChange: (value: any) => void
}
