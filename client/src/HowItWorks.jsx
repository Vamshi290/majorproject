import React from 'react';

function HowItWorks() {
  return (
    <div className="container text-center my-5">
      <h2 className="text-primary">How Campus Hub Works</h2>
      <p className="text-secondary">A simple 3-step process to retrieve lost items.</p>

      <div className="row justify-content-center mt-4">
        <div className="col-md-4">
          <div className="card bg-light shadow-lg p-3">
            <h5>1️⃣ Report an Item</h5>
            <p>Submit details of your lost or found item.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-light shadow-lg p-3">
            <h5>2️⃣ Browse Listings</h5>
            <p>Check lost and found items listed by others.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-light shadow-lg p-3">
            <h5>3️⃣ Connect & Recover</h5>
            <p>Contact the finder and get your item back!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
