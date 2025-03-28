import React from "react";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>DeFi MVP</h1>
      </header>

      {/* Main content */}
      <main className="landing-main">
        <div className="product-image-container">
          <img
            src="/images/logo_bt.png"
            alt="ScreeningDEX Platform"
            className="product-image"
          />
        </div>
        <section className="product-description">
          <h2>Revolutionize Your Trading Experience</h2>
          <p>
            DeFi MVP is a powerful decentralized exchange platform that combines
            advanced screening tools with seamless trading capabilities. Our
            platform helps you make informed decisions with real-time data and
            analytics.
          </p>
        </section>
        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Advanced Screening</h3>
              <p>
                Filter and analyze assets with our comprehensive screening
                tools.
              </p>
            </div>
            <div className="feature-card">
              <h3>Secure Trading</h3>
              <p>Trade with confidence on our secure decentralized platform.</p>
            </div>
            <div className="feature-card">
              <h3>Real-time Analytics</h3>
              <p>
                Access real-time market data and insights to optimize your
                strategy.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="contact-info">
          <h3>Contact Us</h3>
          <p>Email: info@Defimvp.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Blockchain Street, Crypto City</p>
        </div>
        <div className="copyright">
          <p>&copy; 2023 DeFi MVP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
