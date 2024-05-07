import React, { useState } from 'react';

import './register.scss';
import HttpService from '../../services/http.service.ts';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const [successCode, setSuccessCode] = useState('');
    const [visible, setVisible] = useState(false);
    const [isError, setIsError] = useState(false);
    
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        age: '',
        height: '',
        weight: '',
        medicalCondition: ''
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showSuccessDialog = (message, code) => {
    setSuccessMessage(message);
    setSuccessCode(code)
    setVisible(true);
};

const showErrorDialog = (message, code) => {
    setErrorMessage(message);
    setErrorCode(code)
    setVisible(true);
};


const hideDialog = () => {
    setVisible(false);
};

  const handleSubmit = (e) => {
    e.preventDefault();
    HttpService.post(formData, '/users').then((res: any) => {
        console.log('Form submitted with data:', formData);
        showSuccessDialog(res.status, res.data.message);
        if(res.status === 201){
            navigate('/')
        }
    }).catch((error) => {
        setIsError(true);
        showErrorDialog(error.response.data.code, error.response.data.message);
    });
  };

  // Form validation logic
  const isFormValid = () => {
    return (
      formData.userName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.gender.trim() !== '' &&
      formData.age.trim() !== '' &&
      formData.height.trim() !== '' &&
      formData.weight.trim() !== '' &&
      formData.password === formData.confirmPassword
    );
  };


  return (
    <div className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User Name:</label>
          <input type="text" name="userName" value={formData.userName} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </div>
        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Age:</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} />
        </div>
        <div>
          <label>Height (cm):</label>
          <input type="number" name="height" value={formData.height} onChange={handleChange} />
        </div>
        <div>
          <label>Weight (kg):</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
        </div>
        <div>
          <label>Medical Condition (any):</label>
          <input type="text" name="medicalCondition" value={formData.medicalCondition} onChange={handleChange} />
        </div>
        <button type="submit" disabled={!isFormValid()}>Register</button>
      </form>

      <Dialog
          header= {isError ? "Error Message": "Success"}
          visible={visible}
          style={{ width: '50vw' }}
          onHide={hideDialog}
        >
          <div>
          <p>{isError ? errorCode: successCode} - {isError ? errorMessage : successMessage }</p>
          </div>
        </Dialog>
    </div>
  );
};

export default RegisterForm;
