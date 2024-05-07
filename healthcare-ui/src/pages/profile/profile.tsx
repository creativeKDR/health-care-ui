import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LocalStorageService from '../../services/localStorage.service.ts';
import HealthData from '../health-data/health-data.tsx';
import Dashboard from '../dashboard/dashboard.tsx';
import { Dialog } from 'primereact/dialog';
import HttpService from '../../services/http.service.ts';
import './profile.scss'

const ProfileForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedPage, setSelectedPage] = useState('');
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [successCode, setSuccessCode] = useState('');
  const [isError, setIsError] = useState(false);

  const hideDialog = () => {
    setVisible(false);
  };

  const userName = () =>{
    return LocalStorageService.getUserName()
  }

  const getUserId = () =>{
    return LocalStorageService.getUserID()
  }
  
  const handleLogout = () => {
    // Implement logout functionality
    LocalStorageService.clear();
    navigate('/')
    console.log('Logout clicked');
  };
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    medicalCondition: ''
  });

  useEffect(() => {
    // Retrieve profile data from localStorage or API
    let userId = getUserId();
      HttpService.get(`/users/${userId}`).then((res: any) => {
        setFormData(res.data);
        setIsEditMode(true);
    }).catch((error) => {
      console.log(error.response)
    });
  }, []);

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
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isEditMode){
      let userId = getUserId()
      HttpService.patch(formData, `/users/${userId}`).then((res: any) => {
        showSuccessDialog(res.status, res.data.message);
    }).catch((error) => {
        setIsError(true);
        showErrorDialog(error.response?.data.code, error.response.data.message);
    });
    }
  };

  // Helper function to render the selected page
  const renderPage = () => {
    switch (selectedPage) {
      case 'health-data':
        return <HealthData />;
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <ProfileForm />;
      default:
        return null;
    }
  };

  // Form validation logic
  const isFormValid = () => {
    return (
      formData.userName !== '' &&
      formData.email !== '' &&
      formData.gender !== ''
    );
  };

  return (
    <div className="profile-form-container">
      <div className="navbar">
        <div className="brand">Health Care IO</div>
        <ul className="nav-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/health-data">Health Data</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li className="dropdown">
            <button className="dropbtn">{userName()}</button>
            <div className="dropdown-content">
            <button onClick={handleLogout}>Logout</button>
            </div>
          </li>
        </ul>
      </div>
      <h2>Update Profile</h2>
      {renderPage()}
      <div className="profile-form">
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
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
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
        <button type="submit" disabled={!isFormValid()}>Update</button>
      </form>
      </div>

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

export default ProfileForm;
