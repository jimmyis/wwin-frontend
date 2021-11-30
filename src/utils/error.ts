import { transctionErrorGenerator } from './blockchain'

export function errorIdentifier(error: any) {
    let type = "INTERNAL ERROR"
    let error_codes = ["0000"]

    if (error?.message === "Internal JSON-RPC error.") {
        return transctionErrorGenerator(error)
    } else {
        return { type, error_codes }
    }
}

export function throwError(error: any) {
    throw error
}

export function cummulativeThrowErrors(this: any) {
    const errors: any[] = []

    const funcs = {
        get(error: any, dependency?: any) {
            errors.push(error)
            return dependency
        },
        check() {
            if (errors.length > 0) throwError(errors);
        }
    }

    return funcs
}
