import ClientPrincipal from './clientPrincipal';

export default interface Identity {
    clientPrincipal: ClientPrincipal,
    loggedIn: number
}