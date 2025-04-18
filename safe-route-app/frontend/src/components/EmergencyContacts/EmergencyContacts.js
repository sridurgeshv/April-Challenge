import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmergencyContacts.css';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phoneNumber: '',
    relationship: '',
    bloodGroup: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/emergency-contacts');
        setContacts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Failed to load emergency contacts');
        setLoading(false);
        // Initialize with empty contacts array instead of showing error
        setContacts([]);
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
    
    if (!newContact.bloodGroup.trim()) {
      errors.bloodGroup = 'Blood group is required';
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
        setNewContact({ name: '', phoneNumber: '', relationship: '', bloodGroup: '' });
        setShowAddForm(false);
      } catch (err) {
        console.error('Error adding contact:', err);
        setError('Failed to add contact');
      }
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      // Fix: Added the base URL to the delete request
      await axios.delete(`http://localhost:5000/api/emergency-contacts/${id}`);
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
    return <div className="contacts__loading">Loading contacts...</div>;
  }

  return (
    <div className="contacts">
      <div className="contacts__header">
        <h2 className="contacts__title">Emergency Contacts</h2>
        <p className="contacts__description">
          These contacts will be notified during emergency situations
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="contacts__empty">
          <p>No emergency contacts added yet.</p>
        </div>
      ) : (
        <div className="contacts__list">
          {contacts.map(contact => (
            <div key={contact._id} className="contacts__card">
              <div className="contacts__info">
                <div className="contacts__name">{contact.name}</div>
                <div className="contacts__details">
                  <span className="contacts__relationship">{contact.relationship}</span>
                  <span className="contacts__phone">{contact.phoneNumber}</span>
                  <span className="contacts__blood">Blood: {contact.bloodGroup || 'Unknown'}</span>
                </div>
              </div>
              <button 
                className="contacts__delete"
                onClick={() => handleDeleteContact(contact._id)}
                aria-label="Delete contact"
              >
                <span className="contacts__delete-icon">×</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddForm ? (
        <form className="contacts__form" onSubmit={handleAddContact}>
          <div className="contacts__form-group">
            <label className="contacts__label">Name</label>
            <input
              type="text"
              name="name"
              className="contacts__input"
              value={newContact.name}
              onChange={handleInputChange}
              placeholder="Contact name"
            />
            {validationErrors.name && <span className="contacts__error-text">{validationErrors.name}</span>}
          </div>
          
          <div className="contacts__form-group">
            <label className="contacts__label">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              className="contacts__input"
              value={newContact.phoneNumber}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
            />
            {validationErrors.phoneNumber && <span className="contacts__error-text">{validationErrors.phoneNumber}</span>}
          </div>
          
          <div className="contacts__form-group">
            <label className="contacts__label">Relationship</label>
            <select
              name="relationship"
              className="contacts__select"
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
            {validationErrors.relationship && <span className="contacts__error-text">{validationErrors.relationship}</span>}
          </div>

          <div className="contacts__form-group">
            <label className="contacts__label">Blood Group</label>
            <select
              name="bloodGroup"
              className="contacts__select"
              value={newContact.bloodGroup}
              onChange={handleInputChange}
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="Unknown">Unknown</option>
            </select>
            {validationErrors.bloodGroup && <span className="contacts__error-text">{validationErrors.bloodGroup}</span>}
          </div>
          
          <div className="contacts__form-buttons">
            <button type="submit" className="contacts__save-btn">Save Contact</button>
            <button 
              type="button" 
              className="contacts__cancel-btn"
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
          className="contacts__add-btn"
          onClick={() => setShowAddForm(true)}
          disabled={contacts.length >= 4}
        >
          {contacts.length >= 4 ? 'Maximum contacts reached (4)' : '+ Add Emergency Contact'}
        </button>
      )}
      
      {contacts.length > 0 && (
        <div className="contacts__note">
          <p>Your emergency contacts will only be notified during actual emergencies.</p>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;