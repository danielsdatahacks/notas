import React, {useState} from 'react';
import App from './App';
import LoginPage from './LoginPage';
import Identity from './models/identity';


export default function Main() {
    const [identity, setIdentity]: [Identity, React.Dispatch<React.SetStateAction<Identity>>] = useState({loggedIn: 0, clientPrincipal: {identityProvider: "", userDetails: "", userId: "", userRoles: [] as string[]}});

    return (
        <React.Fragment>
            {
                identity.loggedIn === 0 && <LoginPage identity={identity} setIdentity={setIdentity}/>
            }
            {
                identity.loggedIn === 1 && <App identity={identity}/>
            }
        </React.Fragment>
    )
}