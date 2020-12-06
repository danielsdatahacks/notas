import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import NotasLogo from './Icons/logo512.png';
import './Stylings/login.css';


interface Props {
    loggedIn: boolean,
    setLogin: React.Dispatch<React.SetStateAction<boolean>>
}

export default function LoginPage(props: Props) {

    //const [userDetails, setUserDetails]: [any, React.Dispatch<React.SetStateAction<any>>] = useState({});

    function onClickLogin() {
        props.setLogin(!props.loggedIn);
    }

    async function getUserInfo() {
        fetch("/.auth/me")
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                //setUserDetails(data);
            })
        .catch(console.log);


        // const response = await fetch("/.auth/me");
        // const payload = await response.json();
        // const { clientPrincipal } = payload;
        // console.log(clientPrincipal);
        // setUserDetails(clientPrincipal);
    }

    return (
        <div className="login-container">
            <div className="login-logo-container">
                <img className="notas-logo-login" src={NotasLogo} alt=""/>
                <div className="notas-logo-login-writing">Notas</div>
            </div>
            <div className="login-input">
                <Form.Control type="email" placeholder="Enter email" />
            </div>
            <div className="login-input">
                <Form.Control type="password" placeholder="Password" />
            </div>
            <div className="login-input">
                <a href="/.auth/login/aad">Login</a>
            </div>
            <div className="login-input" onClick={getUserInfo}>
                GET USER DETAILS
            </div>
            {/* <div className="login-input">
                {userDetails}
            </div> */}
            <div className="login-button" onClick={onClickLogin}>
                <Button variant="outline-dark">Login</Button>
            </div>
        </div>
    )

}