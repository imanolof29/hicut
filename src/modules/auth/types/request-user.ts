import { TokenPayload } from "./token-payload";

export type RequestUser = TokenPayload & {
    ownedBusinessId?: string
    workplaceId?: string
}