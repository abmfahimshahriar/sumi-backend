import jwt_decode from "jwt-decode";

export const getUserId = (token: string) => {
    const decoded: any = jwt_decode(token);

    return decoded.UserId;
}