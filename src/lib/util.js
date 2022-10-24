/**
 * Paginates an array of data.
 *
 * @param {any[]} data
 * @param {{ page?: number, limit: number }} args
 * @returns
 */
export function paginate(data, { page = 1, limit } = {}) {
  if (limit) {
    let dataToReturn = data.slice((page - 1) * limit, page * limit)
    return dataToReturn;
  }

  return data
}
