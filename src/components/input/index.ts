import { FieldError } from 'react-hook-form'
import { InputProvider } from './main'
import { SelectProvider } from './select'
import { RadioProvider } from './radio'
import { ImageProvider } from './image'
import { MediaProvider } from './media'
import { TextareaProvider } from './textarea'
import { CheckboxProvider } from './checkbox'
import { PropertyProvider } from './property'
import { TagsProvider } from './tags'

export const Input = {
  Main: InputProvider,
  Select: SelectProvider,
  Radio: RadioProvider,
  Image: ImageProvider,
  Media: MediaProvider,
  Textarea: TextareaProvider,
  Checkbox: CheckboxProvider,
  Property: PropertyProvider,
  Tags: TagsProvider
}

export const getErrors = (errors?: FieldError | FieldError[]): string | null => {
  if (!errors) return null
  let results: any = ''
  let error = errors instanceof Array ? errors[0] : errors

  switch (error.type) {
    case 'required':
      results = error.message || 'This Field is required!'
      break

    default:
      results = error.message
      break
  }

  return results
}
