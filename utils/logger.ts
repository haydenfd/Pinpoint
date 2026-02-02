export const isDev = process.env.NODE_ENV === "development"

const noop = () => {}

export const log = isDev ? (...args: unknown[]) => console.log(...args) : noop
export const warn = isDev ? (...args: unknown[]) => console.warn(...args) : noop
export const error = isDev ? (...args: unknown[]) => console.error(...args) : noop
