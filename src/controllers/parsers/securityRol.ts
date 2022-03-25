import {PermissionsDTO, PermissionsShortDTO} from "./permission";

export const SecurityRolShortDTO = (request) => ({
    id: request.id,
    name: request.name,
    permissions: request.permissions && request.permissions.map(item => PermissionsDTO(item))
});

export const SecurityRolArrayShortDTO = (request) => ({
    id: request.id,
    name: request.name,
    permissions: request.permissions && request.permissions.map(item => item.permission) || []
});
