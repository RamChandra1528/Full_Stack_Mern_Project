import { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [Data , setData] = useState([])
  useEffect(()=>{
    fetch('http://localhost:3000/')
    .then(Data => Data.json())
    .then(data => setData(data))
  })
  // const cards = [
  //   {
  //     title: 'Advanced Learning',
  //     description: 'Experience cutting-edge educational methodologies and interactive learning environments designed for the modern student.',
  //   },
  //   {
  //     title: 'Industry Integration',
  //     description: 'Bridge the gap between academia and industry with real-world projects and industry collaboration opportunities.',
  //   },
  //   {
  //     title: 'Innovation Hub',
  //     description: 'Access state-of-the-art facilities and resources to transform your innovative ideas into impactful solutions.',
  //   },
  // ];

  return (
    <div className="home">
      <div className="container">
        <h1>Welcome to 6CSE1</h1>
        <div className="cards">
          {Data.map((card, index) => (
            <div key={index} className="card">
              <h2>{card.firstName}</h2>
              <p>{card.lastName}</p>
              <p>{card.username}</p>
              <p>{card.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;



/*
import { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [data, setData] = useState([]); // Initialize as an empty array

  useEffect(() => {
    fetch('http://localhost:3000/') // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="home">
      <div className="container">
        <h1>Welcome to 6CSE1</h1>
        <div className="cards">
          {data.length > 0 ? (
            data.map((card, index) => (
              <div key={index} className="card">
                <h2>{card.firstName}</h2>
                <p>{card.email}</p>
              </div>
            ))
          ) : (
            <p>Loading data...</p> // Show a loading message if data is empty
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

*/