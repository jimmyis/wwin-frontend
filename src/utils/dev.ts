export const dev: any = {
    log() {
        if (process.env.NEXT_PUBLIC_BUILD_ENV === "development" || process.env.NEXT_PUBLIC_ENVIRONMENT === "development") {
            console.log(...arguments)
            
        }
    },
    error() {
        if (process.env.NEXT_PUBLIC_BUILD_ENV === "development" || process.env.NEXT_PUBLIC_ENVIRONMENT === "development") {
           console.error(...arguments)
        }
    }
}
