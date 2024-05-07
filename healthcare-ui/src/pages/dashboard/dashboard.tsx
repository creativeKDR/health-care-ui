import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import './dashboard.scss';
import LocalStorageService from '../../services/localStorage.service.ts';
import { Link, useNavigate } from 'react-router-dom';
import ProfileForm from '../profile/profile.tsx';
import HealthData from '../health-data/health-data.tsx';
import HttpService from '../../services/http.service.ts';
import { ProgressBar } from 'primereact/progressbar';


const Dashboard = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState('');
  const [isUserHealthDataFound, setUserHealthData] = useState(false);
  const [bloodPressure, setBloodPressure] = useState('');
  const [sugarLevel, setSugarLevel] = useState('');
  const [symtoms, setSymptoms] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setLoading] = useState(false);

  const showDialog = (message) => {
    setErrorMessage(message);
    setVisible(true);
  };

  const userName = () =>{
    return LocalStorageService.getUserName()
  }

  const getUserId = () =>{
    return LocalStorageService.getUserID()
  }


  const hideDialog = () => {
    setVisible(false);
  };

  const handleLogout = () => {
    // Implement logout functionality
    LocalStorageService.clear();
    navigate('/')
    console.log('Logout clicked');
  };

  const handleNavClick = (page) => {
    setSelectedPage(page);
  };

  useEffect(() => {
    // Retrieve user data from API
    let userId = getUserId();
      HttpService.get(`/health/users/${userId}`).then((res: any) => {
        if(res.data){
          setUserHealthData(true);
          setBloodPressure(res.data.bloodPressure);
          setSugarLevel(res.data.bloodSugarLevel);
          setSymptoms(res.data.symptoms);
        }
        else{
          setUserHealthData(false);
        }
        
    }).catch((error) => {
      console.log(error.response)
    });

    HttpService.get(`/users/${userId}`).then((res: any) => {
      if(res.data){
        setHeight(res.data.height);
        setWeight(res.data.weight);
      }
  }).catch((error) => {
    console.log(error.response)
  });
  }, []);

  // Helper function to render the selected page
  const renderPage = () => {
    switch (selectedPage) {
      case 'health-data':
        return <HealthData />;
      case 'profile':
        return <ProfileForm />;
      default:
        return null;
    }
  };

  const generateReports = () => {
    setLoading(true);
    let userData = {
      height: height,
      weight: weight,
      symptoms: symtoms,
      bloodPressure: bloodPressure,
      sugarLevel: sugarLevel
    }
    HttpService.post(userData, '/query').then((res: any) => {
        setResult(res.data.result);  
    }).catch((error) => {
        showDialog(error.response.data.message);
    }).then((res) => {
        setLoading(false);
    })
}

  return (
    <div className="dashboard">
      <div className="navbar">
        <div className="brand">Health Care IO</div>
        <ul className="nav-links">
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
        <h2>Dashboard</h2>
        {!isUserHealthDataFound ? <h3>Please enter health data first</h3> : <div>
          <h3>According to health your health improvement plan:</h3>
          <button onClick={generateReports}>Generate</button>
          <div>{isLoading ? "Please Wait..." : (result)}</div>
          
          </div>}
        {renderPage()}
        
        <Dialog
          header="Error Message"
          visible={visible}
          style={{ width: '50vw' }}
          onHide={hideDialog}
        >
          <div>
            <p>{errorMessage}</p>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
