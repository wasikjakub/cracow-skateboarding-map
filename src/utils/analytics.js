import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = () => {
  ReactGA.initialize('G-SFYJFF7F1X');
};

// Track page views
export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Track custom events
export const logEvent = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

// Track form submissions
export const logFormSubmission = (formName) => {
  logEvent('Form', 'Submit', formName);
};

// Track map interactions
export const logMapInteraction = (action, spotName) => {
  logEvent('Map', action, spotName);
};

// Track spot views
export const logSpotView = (spotName) => {
  logEvent('Spot', 'View', spotName);
}; 