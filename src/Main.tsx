import React, {useState} from 'react';
import App from './App';
import LoginPage from './LoginPage';


export default function Main() {
    const [loggedIn, setLogin] = useState(false);

    return (
        <React.Fragment>
            {
                !loggedIn && <LoginPage loggedIn={loggedIn} setLogin={setLogin}/>
            }
            {
                loggedIn && <App/>
            }
        </React.Fragment>
    )
}