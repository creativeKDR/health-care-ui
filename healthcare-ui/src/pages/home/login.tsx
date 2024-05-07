import React from "react";
import { FC, useEffect, useState } from "react";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

import './login.scss';

import HttpService from "../../services/http.service.ts";
import LocalStorageService from "../../services/localStorage.service.ts";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";



interface LoginProps { };

const Login: FC<LoginProps> = (props) => {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const [visible, setVisible] = useState(false);

    const showDialog = (message, code) => {
        setErrorMessage(message);
        setErrorCode(code)
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
    };

    useEffect(() => {
        LocalStorageService.clear();
    }, [])

    const login = (user: any) => {
        let userData = JSON.stringify(user);
        HttpService.post(userData, '/login').then((res: any) => {
            validateUser(res.data);
        }).catch((error) => {
            showDialog(error.response.data.code, error.response.data.message);
        });
    }

    const validateUser = (res: any) => {
        if (res && res.accessToken) {
            //once user is validated then store the data in local storage service
            LocalStorageService.saveAccessToken(res.accessToken);
            LocalStorageService.saveUserID(res.userId);
            LocalStorageService.saveUserName(res.userName);
            navigate('/dashboard')
        }
    }

    const [password, setPassword] = useState("");
    const handleLogin = () => {
        let user = {
            email: userName,
            password: password,
        }
        login(user);
    }

    return (
        <div className="login-form-container">
    <Card className="login-card">
        <h2>Login</h2>
        <div className="grid p-fluid login-field-container">
            <div className="col-12 md:col-4 login-field">
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-user"></i>
                    </span>
                    <InputText value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Username" />
                </div>
            </div>
            <div className="col-12 md:col-4 login-field">
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-lock"></i>
                    </span>
                    <Password inputId="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </div>
            </div>
            <div className="button-field">
                <Button label="Login" onClick={handleLogin} />
            </div>
            <p>Don't have an account? <Link to="/register">Create one</Link></p>
            <span className="clear"></span>
        </div>
    </Card>
    <Dialog
          header="Error Message"
          visible={visible}
          style={{ width: '50vw' }}
          onHide={hideDialog}
        >
          <div>
          <p>{errorCode} - {errorMessage}</p>
          </div>
        </Dialog>
</div>
)
}

export default Login;
