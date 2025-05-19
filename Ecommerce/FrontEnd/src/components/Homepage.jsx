import React from 'react'
import { Link } from 'react-router-dom';
function Homepage() {


  return (
    <>

  <div style={{ paddingTop: '75px' }}>
      <div className="home-container">
        <div className="overlay"></div>
        <div className="content">
          <h1>

          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aperiam architecto corporis culpa cum, dignissimos dolorem eaque eligendi id incidunt maxime odit praesentium qui repellat sapiente sed tempora veritatis voluptate?
          </p>
          <button style={{ backgroundColor: "#E3BE84", height: '30px', width: '100px', borderStyle: 'none' }}>
            <Link to='/mens' style={{ textDecoration: 'none', color: 'white' }}> Shop Now</Link>
          </button>
        </div>
      </div>
      </div>

    </>
  );
}

export default Homepage