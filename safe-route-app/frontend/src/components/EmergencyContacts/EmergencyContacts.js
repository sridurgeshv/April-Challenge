import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmergencyContacts.css';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phoneNumber: '',
    relationship: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // In a real app, you'd include authentication headers
        const response = await axios.get('http://localhost:5000/api/emergency-contacts');
        setContacts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Failed to load emergency contacts');
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!newContact.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!newContact.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(newContact.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!newContact.relationship.trim()) {
      errors.relationship = 'Relationship is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:5000/api/emergency-contacts', newContact);
        setContacts([...contacts, response.data]);
        setNewContact({ name: '', phoneNumber: '', relationship: '' });
        setShowAddForm(false);
      } catch (err) {
        console.error('Error adding contact:', err);
        setError('Failed to add contact');
      }
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`/api/emergency-contacts/${id}`);
      setContacts(contacts.filter(contact => contact._id !== id));
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({
      ...newContact,
      [name]: value
    });
    
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined
      });
    }
  };

  if (loading) {
    return <div className="emergency-contacts">Loading contacts...</div>;
  }

  if (error) {
    return <div className="emergency-contacts error">{error}</div>;
  }

  return (
    <div className="emergency-contacts">
      <div className="contacts-header">
        <h3>Emergency Contacts</h3>
        <p className="contacts-description">
          These contacts will be notified in case of an emergency when you use the SOS feature
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="no-contacts">
          <p>No emergency contacts added yet.</p>
        </div>
      ) : (
        <div className="contacts-list">
          {contacts.map(contact => (
            <div key={contact._id} className="contact-card">
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-phone">{contact.phoneNumber}</div>
                <div className="contact-relationship">{contact.relationship}</div>
              </div>
              <button 
                className="delete-contact"
                onClick={() => handleDeleteContact(contact._id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddForm ? (
        <form className="add-contact-form" onSubmit={handleAddContact}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={newContact.name}
              onChange={handleInputChange}
              placeholder="Contact name"
            />
            {validationErrors.name && <span className="error">{validationErrors.name}</span>}
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={newContact.phoneNumber}
              onChange={handleInputChange}
              placeholder="Format: +1 (555) 123-4567"
            />
            {validationErrors.phoneNumber && <span className="error">{validationErrors.phoneNumber}</span>}
          </div>
          
          <div className="form-group">
            <label>Relationship</label>
            <select
              name="relationship"
              value={newContact.relationship}
              onChange={handleInputChange}
            >
              <option value="">Select relationship</option>
              <option value="Spouse">Spouse</option>
              <option value="Parent">Parent</option>
              <option value="Child">Child</option>
              <option value="Sibling">Sibling</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>
            {validationErrors.relationship && <span className="error">{validationErrors.relationship}</span>}
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="save-button">Save Contact</button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => {
                setShowAddForm(false);
                setValidationErrors({});
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button 
          className="add-contact-button"
          onClick={() => setShowAddForm(true)}
          disabled={contacts.length >= 4}
        >
          {contacts.length >= 4 ? 'Maximum contacts reached (4)' : 'Add Emergency Contact'}
        </button>
      )}
      
      {contacts.length > 0 && (
        <div className="contacts-note">
          <p>Your emergency contacts will only be notified when you trigger the SOS emergency button.</p>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;