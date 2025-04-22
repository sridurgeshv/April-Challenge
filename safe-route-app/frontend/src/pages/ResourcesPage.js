import React, { useState } from 'react';
import '../styles/ResourcesPage.css';

const ResourcesPage = () => {
  const [activeCategory, setActiveCategory] = useState('emergency-kits');

  const resources = {
    'emergency-kits': [
      {
        title: 'Basic Emergency Kit',
        items: [
          'Water (one gallon per person per day for at least three days)',
          'Non-perishable food (at least a three-day supply)',
          'Battery-powered or hand crank radio',
          'Flashlight and extra batteries',
          'First aid kit',
          'Whistle to signal for help',
          'Dust mask, plastic sheeting and duct tape',
          'Moist towelettes, garbage bags and plastic ties',
          'Wrench or pliers to turn off utilities',
          'Manual can opener',
          'Local maps',
          'Cell phone with chargers and backup battery'
        ]
      },
      {
        title: 'Family Emergency Kit',
        items: [
          'All items in the Basic Emergency Kit',
          'Prescription medications and glasses',
          'Infant formula and diapers',
          'Pet food and extra water for your pet',
          'Important family documents in a waterproof container',
          'Cash or travelers checks',
          'Emergency reference material',
          'Sleeping bag or warm blanket for each person',
          'Complete change of clothing',
          'Fire extinguisher',
          'Matches in a waterproof container',
          'Feminine supplies and personal hygiene items',
          'Mess kits, paper cups, plates, paper towels, plastic utensils',
          'Paper and pencil',
          'Books, games, puzzles or other activities for children'
        ]
      }
    ],
    'evacuation-plans': [
      {
        title: 'Home Evacuation Plan',
        steps: [
          'Identify all possible exits from your home',
          'Determine a meeting place outside your home',
          'Practice your evacuation plan with all household members',
          'Keep evacuation routes clear of clutter',
          'Know how to shut off utilities if necessary',
          'Plan for pets and special needs family members',
          'Prepare a go-bag for each household member'
        ]
      },
      {
        title: 'Community Evacuation Guidance',
        steps: [
          'Learn your communitys evacuation routes',
          'Identify potential shelter locations',
          'Plan alternative evacuation routes',
          'Know the emergency alert system signals for your area',
          'Establish an out-of-area contact person',
          'Keep at least half a tank of gas in your vehicle',
          'Take only essential items when evacuating',
          'Follow evacuation orders promptly'
        ]
      }
    ],
    'preparation-checklists': [
      {
        title: 'Severe Weather Preparation',
        items: [
          'Monitor local weather reports',
          'Secure outdoor furniture and objects',
          'Trim trees near structures and power lines',
          'Clear rain gutters and downspouts',
          'Check sump pump operation',
          'Prepare for power outages',
          'Review evacuation plans',
          'Stock emergency supplies'
        ]
      },
      {
        title: 'Wildfire Preparation',
        items: [
          'Create defensible space around your home',
          'Clear leaves and debris from gutters and roof',
          'Remove flammable materials from around structures',
          'Prepare evacuation plan and emergency kit',
          'Install smoke detectors and fire extinguishers',
          'Have a garden hose long enough to reach any area of your home',
          'Consider fire-resistant landscaping',
          'Know multiple evacuation routes'
        ]
      },
      {
        title: 'Earthquake Preparation',
        items: [
          'Secure heavy furniture to walls',
          'Install latches on cabinets',
          'Store breakable items in low, closed cabinets',
          'Know "Drop, Cover, and Hold On" procedure',
          'Identify safe spots in each room',
          'Check for hazards after shaking stops',
          'Prepare for aftershocks',
          'Practice earthquake drills'
        ]
      }
    ]
  };

  const downloadableResources = [
    {
      title: 'Emergency Preparedness Guide',
      format: 'PDF',
      size: '2.4 MB'
    },
    {
      title: 'Family Communication Plan Template',
      format: 'PDF',
      size: '1.1 MB'
    },
    {
      title: 'Evacuation Checklist',
      format: 'PDF',
      size: '845 KB'
    },
    {
      title: 'First Aid Quick Reference',
      format: 'PDF',
      size: '1.8 MB'
    }
  ];

  return (
    <div className="resources-container">
      <div className="resources-hero">
        <div className="resources-hero-gradient"></div>
        <div className="resources-hero-content">
          <h1 className="resources-title">Emergency Preparation Guide</h1>
          <p className="resources-subtitle">Comprehensive resources to help you prepare for any emergency</p>
        </div>
      </div>

      <div className="resources-nav">
        <div className="resources-nav-tabs">
          <button 
            className={`resources-tab ${activeCategory === 'emergency-kits' ? 'active' : ''}`}
            onClick={() => setActiveCategory('emergency-kits')}
          >
            Emergency Kits
          </button>
          <button 
            className={`resources-tab ${activeCategory === 'evacuation-plans' ? 'active' : ''}`}
            onClick={() => setActiveCategory('evacuation-plans')}
          >
            Evacuation Plans
          </button>
          <button 
            className={`resources-tab ${activeCategory === 'preparation-checklists' ? 'active' : ''}`}
            onClick={() => setActiveCategory('preparation-checklists')}
          >
            Preparation Checklists
          </button>
        </div>
      </div>

      <div className="resources-content">
        <div className="resources-main">
          {resources[activeCategory].map((resource, index) => (
            <div key={index} className="resource-card">
              <h2 className="resource-card-title">{resource.title}</h2>
              {resource.items && (
                <ul className="resource-list">
                  {resource.items.map((item, i) => (
                    <li key={i} className="resource-list-item">{item}</li>
                  ))}
                </ul>
              )}
              {resource.steps && (
                <ol className="resource-steps">
                  {resource.steps.map((step, i) => (
                    <li key={i} className="resource-step-item">{step}</li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>

        <div className="resources-sidebar">
          <div className="resources-downloads">
            <h3 className="sidebar-title">Downloadable Resources</h3>
            <div className="download-list">
              {downloadableResources.map((download, index) => (
                <div key={index} className="download-item">
                  <div className="download-info">
                    <span className="download-title">{download.title}</span>
                    <span className="download-meta">{download.format} • {download.size}</span>
                  </div>
                  <button className="download-button">Download</button>
                </div>
              ))}
            </div>
          </div>

          <div className="emergency-contacts">
            <h3 className="sidebar-title">Emergency Contacts</h3>
            <div className="contact-list">
              <div className="contact-item">
                <div className="contact-icon">🚑</div>
                <div className="contact-info">
                  <span className="contact-title">Emergency Services</span>
                  <span className="contact-value">911</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🚒</div>
                <div className="contact-info">
                  <span className="contact-title">Fire Department</span>
                  <span className="contact-value">911</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">👮</div>
                <div className="contact-info">
                  <span className="contact-title">Police Department</span>
                  <span className="contact-value">911</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🏥</div>
                <div className="contact-info">
                  <span className="contact-title">Poison Control</span>
                  <span className="contact-value">1-800-222-1222</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="resources-cta">
        <div className="cta-content">
          <h2 className="cta-title">Schedule a Preparedness Assessment</h2>
          <p className="cta-text">Our emergency preparedness experts can help evaluate your readiness and provide personalized recommendations.</p>
          <button className="cta-button">Request Assessment</button>
        </div>
      </div>
      
      <div className="resources-footer">
        <p className="resources-footer-text">
          These resources are provided as general guidance. Always follow official instructions during an actual emergency.
        </p>
      </div>
    </div>
  );
};

export default ResourcesPage;