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

    function onClickLogin() {
        props.setLogin(!props.loggedIn);
    }

    return (
        <div className="login-container" onClick={onClickLogin}>
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
            <div className="login-button">
                <Button variant="outline-dark">Login</Button>
            </div>
        </div>
    )

}