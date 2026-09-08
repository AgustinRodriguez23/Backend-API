
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export function normalizePagination({ page, pageSize } = {}) {
    let parsedPage = parseInt(page, 10)
    let parsedPageSize = parseInt(pageSize, 10)

    if (isNaN(parsedPage) || parsedPage < 1) {
        parsedPage = 1
    }

    if (isNaN(parsedPageSize) || parsedPageSize < 1) {
        parsedPageSize = DEFAULT_PAGE_SIZE
    } else if (parsedPageSize > MAX_PAGE_SIZE) {
        parsedPageSize = MAX_PAGE_SIZE
    }

    return {
        page: parsedPage,
        pageSize: parsedPageSize,
        skip: (parsedPage - 1) * parsedPageSize
    }
}