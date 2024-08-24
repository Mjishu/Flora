import moment from "moment"

export default class authService {
    setLocalStorage(responseObj: any) {//responseObj is a json obj
        const expires = moment().add(responseObj.expiresIn, "day")

        localStorage.setItem("token", responseObj.token)
        localStorage.setItem("expires", JSON.stringify(expires.valueOf()))
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("expires");
    }

    isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires");
        const expiresAt = expiration && JSON.parse(expiration);
        return moment(expiresAt)
    }
}