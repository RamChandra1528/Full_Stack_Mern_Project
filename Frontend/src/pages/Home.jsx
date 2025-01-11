import { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch data from the server
    fetch('http://localhost:5000', {
      headers: {
        'Authorization': `Bearer ${token}`, // Correct syntax for token interpolation
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => {
        console.error('Error fetching data:', error); // Improved error handling
      });
  }, [token]); // Added `token` as a dependency to ensure the effect runs when `token` changes

  return (
    <div className="home">
      <div className="container">
        <h1>Welcome to 6CSE1</h1>
        <div className="cards">
          {data.length > 0 ? (
            data.map((card, index) => (
              <div key={index} className="card">
                <h2>{card.firstName}</h2>
                <p>{card.username}</p>
                <p>{card.email}</p>
              </div>
            ))
          ) : (
            <p>No data available</p> // Fallback when there's no data
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
