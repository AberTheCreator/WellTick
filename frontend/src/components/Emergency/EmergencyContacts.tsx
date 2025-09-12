import React, { useState, useEffect } from 'react';

interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  medicalInfo?: string;
}

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
    medicalInfo: ''
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/emergency/contacts');
      const data = await response.json();
      
      
      const enhancedContacts: EmergencyContact[] = [
        {
          id: 1,
          name: 'Emergency Services',
          phone: '911',
          relationship: 'Emergency',
          isPrimary: true
        },
        {
          id: 2,
          name: 'Poison Control',
          phone: '1-800-222-1222',
          relationship: 'Medical Emergency',
          isPrimary: true
        },
        ...data.filter((contact: any) => contact.name !== '911')
      ];
      
      setContacts(enhancedContacts);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const addContact = async () => {
    if (!newContact.name || !newContact.phone) return;

    const contact: EmergencyContact = {
      id: Date.now(),
      ...newContact,
      isPrimary: false
    };

    try {
      const response = await fetch('/api/emergency/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });

      if (response.ok) {
        setContacts(prev => [...prev, contact]);
        setNewContact({ name: '', phone: '', relationship: '', medicalInfo: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };

  const callContact = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const deleteContact = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(prev => prev.filter(contact => contact.id !== id));
    }
  };

  return (
    <div style={{ padding: '16px', minHeight: '100vh', background: '#f8f9fa', paddingBottom: '80px' }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
            Emergency Contacts
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #007ACC, #00BFA6)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ➕ Add Contact
          </button>
        </div>

        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button
            onClick={() => callContact('911')}
            style={{
              flex: 1,
              minWidth: '140px',
              padding: '16px',
              background: '#e53935',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            🚨 Call 911
          </button>
          <button
            onClick={() => callContact('1-800-222-1222')}
            style={{
              flex: 1,
              minWidth: '140px',
              padding: '16px',
              background: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            ☢️ Poison Control
          </button>
        </div>

        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              style={{
                padding: '16px',
                background: contact.isPrimary ? '#fff3e0' : '#f8f9fa',
                borderRadius: '12px',
                border: contact.isPrimary ? '2px solid #FF9800' : '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>
                    {contact.name}
                  </h3>
                  {contact.isPrimary && (
                    <span style={{
                      padding: '2px 8px',
                      background: '#FF9800',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      PRIMARY
                    </span>
                  )}
                </div>
                <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
                  📞 {contact.phone}
                </p>
                <p style={{ margin: '4px 0', color: '#666', fontSize: '12px' }}>
                  {contact.relationship}
                </p>
                {contact.medicalInfo && (
                  <p style={{ 
                    margin: '8px 0 0 0', 
                    color: '#007ACC',
                    fontSize: '12px',
                    fontStyle: 'italic'
                  }}>
                    Medical Info: {contact.medicalInfo}
                  </p>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => callContact(contact.phone)}
                  style={{
                    padding: '8px 12px',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  📞 Call
                </button>
                {!contact.isPrimary && (
                  <button
                    onClick={() => deleteContact(contact.id)}
                    style={{
                      padding: '8px 12px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={() => setShowAddForm(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>Add Emergency Contact</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Name *
              </label>
              <input
                type="text"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="Contact name"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="(555) 123-4567"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Relationship
              </label>
              <select
                value={newContact.relationship}
                onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="">Select relationship</option>
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Doctor">Doctor</option>
                <option value="Caregiver">Caregiver</option>
                <option value="Neighbor">Neighbor</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Medical Information (Optional)
              </label>
              <textarea
                value={newContact.medicalInfo}
                onChange={(e) => setNewContact({...newContact, medicalInfo: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minHeight: '60px',
                  resize: 'vertical'
                }}
                placeholder="Any relevant medical information or special instructions"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={addContact}
                disabled={!newContact.name || !newContact.phone}
                style={{
                  flex: 2,
                  padding: '12px',
                  background: (newContact.name && newContact.phone) 
                    ? 'linear-gradient(135deg, #007ACC, #00BFA6)' 
                    : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: (newContact.name && newContact.phone) ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold'
                }}
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;