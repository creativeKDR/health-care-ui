import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LocalStorageService from '../../services/localStorage.service.ts';
import ProfileForm from '../profile/profile.tsx';
import { Dialog } from 'primereact/dialog';
import Dashboard from '../dashboard/dashboard.tsx';
import './health-data.scss'
import HttpService from '../../services/http.service.ts';

const HealthData = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedPage, setSelectedPage] = useState('');
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [successCode, setSuccessCode] = useState('');
  const [isError, setIsError] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  const userName = () =>{
    return LocalStorageService.getUserName()
  }

  const getUserId = () =>{
    return LocalStorageService.getUserID()
  }

  const [formData, setFormData] = useState({
    id: '',
    userId: getUserId(),
    heartRate: '',
    bloodPressure: '',
    bloodSugarLevel: '',
    symptoms: '',
    medication: '',
    sleepDuration: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isEditMode){
      HttpService.patch(formData, `/health/${formData?.id}`).then((res: any) => {
        showSuccessDialog(res.status, res.data.message);
    }).catch((error) => {
        setIsError(true);
        showErrorDialog(error.response?.data.code, error.response.data.message);
    });
    }else{
      HttpService.post(formData, '/health').then((res: any) => {
        showSuccessDialog(res.status, res.data.message);
    }).catch((error) => {
        setIsError(true);
        showErrorDialog(error.response?.data.code, error.response.data.message);
    });
    }
  };

  useEffect(() => {
    // Retrieve health data from API
    let userId = getUserId();
      HttpService.get(`/health/users/${userId}`).then((res: any) => {
        if(res.data){
          setFormData(res.data);
          setIsEditMode(true);
        }
        else{
          setIsEditMode(false);
        }
        
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

  const hideDialog = () => {
    setVisible(false);
  };
  
  const handleLogout = () => {
    // Implement logout functionality
    LocalStorageService.clear();
    navigate('/')
    console.log('Logout clicked');
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
      formData.heartRate !== '' &&
      formData.bloodSugarLevel !== '' &&
      formData.bloodPressure !== '' &&
      formData.symptoms !== '' &&
      formData.medication !== '' &&
      formData.sleepDuration !== ''
    );
  };
  
  return (
    <div className='health-data'>
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
      <div className="content">
        {renderPage()}
        <div className="health-data-form">
        <h2>{isEditMode ? 'Edit Health Data' : 'Health Data'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Heart Rate (bpm):</label>
          <input type="number" name="heartRate" value={formData.heartRate} onChange={handleChange} />
        </div>
        <div>
          <label>Blood Pressure (mg/dL):</label>
          <input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} />
        </div>
        <div>
          <label>Blood Sugar Level :</label>
          <input type="number" name="bloodSugarLevel" value={formData.bloodSugarLevel} onChange={handleChange} />
        </div>
        <div>
          <label>Symptoms:</label>
          <input type="text" name="symptoms" value={formData.symptoms} onChange={handleChange} />
        </div>
        <div>
          <label>Medication:</label>
          <input type="text" name="medication" value={formData.medication} onChange={handleChange} />
        </div>
        <div>
          <label>Sleep Duration (hours):</label>
          <input type="number" name="sleepDuration" value={formData.sleepDuration} onChange={handleChange} />
        </div>
        <button type="submit"  disabled={!isFormValid()}>{isEditMode ? 'Update' : 'Submit'}</button>
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
      
    </div>
  );
};

export default HealthData;
