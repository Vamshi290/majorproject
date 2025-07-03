import React from 'react';
import './AboutUs.css'; // Import the CSS file

function AboutUs() {
    return (
        <div className="about-container">
            <h2>Welcome to Campus Hub</h2>
            <p>
                Campus Hub is a community-driven platform that helps students and staff find lost items quickly and efficiently. Whether you've misplaced something valuable or found an item on campus, our system makes it easy to report and track lost belongings.
            </p>
            <p>
                Simply post details of the lost or found item, and our smart matching system will notify users about potential matches. With real-time updates and a dedicated community, recovering lost items has never been easier.
            </p>
            <p className="highlight">Join us in keeping our campus connected, responsible, and organized!</p>
            <p className="contact-info">
                📧 For any queries or issues, feel free to contact us at  
                <strong style={{ color: "#1565C0", fontWeight: "bold" }}> campushub86@gmail.com</strong>.
            </p>
        </div>
    );
}

export default AboutUs;
