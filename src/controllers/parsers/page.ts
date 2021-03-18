export const PageDTO = (data: Array<Object>, size = 0, offset = 0, limit = 0) => ({
    meta: {
        totalRegisters: size,
        totalFiltered: data.length,
        offset: offset,
        limit: limit
    },
    data: data
});
