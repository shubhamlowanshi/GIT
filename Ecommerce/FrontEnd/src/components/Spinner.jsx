import React from 'react';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';

const Spinner = () => (
    <div style={{ paddingTop: '75px' }}>x
  <div style={{ textAlign: 'center', padding: '60px 0' }}>
    <BootstrapSpinner animation="border" role="status" variant="warning" />
    <p>Loading...</p>
  </div>
   </div>
);

export default Spinner;
