import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import NotasLogo from './Icons/logo512.png';
import { GithubLoginButton } from "react-social-login-buttons";
import { MicrosoftLoginButton } from "react-social-login-buttons";
import './Stylings/login.css';
import Identity from './models/identity';


interface Props {
    identity: Identity,
    setIdentity: React.Dispatch<React.SetStateAction<Identity>>
}

export default function LoginPage(props: Props) {

    //const [userDetails, setUserDetails]: [any, React.Dispatch<React.SetStateAction<any>>] = useState({});

    // function onClickLogin() {
    //     props.setLogin(!props.loggedIn);
    // }

    async function getUserIdentity() {
        fetch("/.auth/me")
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                console.log(data["clientPrincipal"]);
                //setUserDetails(data);
                let identity: Identity = {clientPrincipal: {identityProvider: "", userDetails: "", userId: "", userRoles: [] as string[]}, loggedIn: 0};
                if(data.clientPrincipal !== null){
                    let identityProvider: string = data.clientPrincipal.identityProvider;
                    let userDetails: string = data.clientPrincipal.userDetails;
                    let userID: string = data.clientPrincipal.userID;
                    let userRoles: string[] = [];
                    data.clientPrincipal.userRoles.map((role: string) =>
                        userRoles.push(role)
                    );
                    identity.clientPrincipal.identityProvider = identityProvider;
                    identity.clientPrincipal.userDetails = userDetails;
                    identity.clientPrincipal.userId = userID;
                    identity.clientPrincipal.userRoles = userRoles;
                    if(userID !== ""){
                        identity.loggedIn = 1;
                    }
                }
                props.setIdentity(identity);
            })
        .catch(console.log);
        // const response = await fetch("/.auth/me");
        // const payload = await response.json();
        // const { clientPrincipal } = payload;
        // console.log(clientPrincipal);
        // setUserDetails(clientPrincipal);
    }

    //Is called on each render
    useEffect(() => {
        getUserIdentity();
    },[props.identity]);

    return (
        <div className="login-container">
            <div className="login-logo-container">
                <img className="notas-logo-login" src={NotasLogo} alt=""/>
                <div className="notas-logo-login-writing">Notas</div>
            </div>
            <a href="/.auth/login/aad" className="login-input">
                <MicrosoftLoginButton/>
            </a>
            {/* <a href="/.auth/login/aad">Login microsoft</a> */}
            {/* <div className="login-input">
                <a href="/.auth/login/aad">Login microsoft</a>
            </div> */}
            <a href="/.auth/login/github" className="login-input">
                <GithubLoginButton/>
            </a>
            {/* <a href="/.auth/login/github">Login github</a> */}
            {/* <div className="login-input" onClick={getUserIdentity}>
                GET USER DETAILS
            </div> */}
            {/* <div className="login-input">
                {userDetails}
            </div> */}
            {/* <div className="login-button" onClick={onClickLogin}>
                <Button variant="outline-dark">Login</Button>
            </div> */}
        </div>
    )

}