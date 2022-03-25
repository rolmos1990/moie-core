export const PermissionsDTO = (request) => ({
    id: request.id,
    permission: request.permission,
    description: request.description
});

export const PermissionsShortDTO = (request) => ({
        id: request.id,
        permission: request.permission
});
