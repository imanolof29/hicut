import { SetMetadata } from "@nestjs/common"
import { UserRoleEnum } from "src/modules/users/entity/user.entity"

export const ROLES_KEY = 'roles'
export const RoleProtected = (...roles: UserRoleEnum[]) => SetMetadata(ROLES_KEY, roles)