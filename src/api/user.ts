import {defHttp} from "@/utils/request.ts";
import type {UserInfo} from "#/user.ts";

enum Api {
    user = "/user"
}

export const getUserInfo = (id: number) => {
    return defHttp.get<UserInfo>(Api.user, {id});
}