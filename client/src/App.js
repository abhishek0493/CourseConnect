import Signup from './components/auth/Signup';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [userTypes, setUserTypes] = useState([]);

  const fetchUserTypes = () => {
    axios
      .get('http://localhost:8000/api/v1/users/categories')
      .then((response) => {
        console.log(response.data);
        setUserTypes(response.data);
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
  };

  useEffect(() => {
    fetchUserTypes();
  }, []);

  return (
    <div className="App">
      <Signup userTypes={userTypes} />
    </div>
  );
}

export default App;
