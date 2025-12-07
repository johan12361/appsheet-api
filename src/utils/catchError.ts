async function catchError<T>(Promise: Promise<T>): Promise<[Error, null] | [null, T]> {
  try {
    const data = await Promise
    return [null, data]
  } catch (error) {
    return [error, null] as [Error, null]
  }
}

export default catchError
