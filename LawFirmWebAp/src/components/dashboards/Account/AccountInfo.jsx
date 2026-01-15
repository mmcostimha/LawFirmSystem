import React, { useState, useEffect } from 'react';
import styles from './AccountInfo.module.css';
import { useUser } from '../../../context/userContext';
import apiRequest from '../../../data/apiRequest';

export default function AccountInfo({ user, setUserInfo }) {
  const [changed, setChanged] = useState(false);
  const [userVar, setUserVar] = useState(user);
  const { token, id } = useUser();

  // Sync internal state if the 'user' prop updates from the parent
  useEffect(() => {
    if (user) setUserVar(user);
  }, [user]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await apiRequest('/api/user', 'PUT', userVar, token);
        if (response.status === 200) {
          setUserInfo(response.data);
          setUserVar(response.data);
          setChanged(false);
        }
      } catch (e) {
        console.error("Error updating user:", e);
      }
    };

    const handleInputChange = (field) => (e) => {
    const newValue = e.target.value;

    // 1. Update the state for the input display
    setUserVar((prev) => {
      const updatedUser = { ...prev, [field]: newValue };

      // 2. Logic to determine if anything has actually changed
      // We compare the updated temporary object against the original 'user' prop
      const isDifferent = 
        updatedUser.name !== user.name || 
        updatedUser.email !== user.email || 
        updatedUser.phone !== user.phone;

      setChanged(isDifferent);
      return updatedUser;
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const link = `/api/user/id/${id}`;
      try {
        const response = await apiRequest(link, 'GET', null, token);
        if (response.status === 200) {
          setUserInfo(response.data);
          setUserVar(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (!user && id) {
      fetchUserData();
    }
  }, [id, token, user, setUserInfo]); // Added necessary dependencies

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Perfil de Administrador</h2>
      </div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <label>Name:</label>
          <input 
            type="text" 
            value={userVar?.name || ''} 
            onChange={handleInputChange('name')} 
          />
        </div>
        <div className={styles.inputContainer}>
          <label>Phone:</label>
          <input 
            type="text" 
            value={userVar?.phone || ''} 
            onChange={handleInputChange('phone')} 
          />
        </div>
        <div className={styles.inputContainer}>
          <label>Email:</label>
          <input 
            type="email" 
            value={userVar?.email || ''} 
            onChange={handleInputChange('email')} 
          />
        </div>
        <div className={styles.inputContainer}>
          <label>Username:</label>
          <input type="text" value={userVar?.username || ''} disabled />
        </div>
        <div className={styles.inputContainer}>
          <label>Created at:</label>
          <input 
            type="text" 
            value={userVar?.creationDate?.split('T')[0] || ''} 
            disabled 
          />
        </div>
        <div className={styles.butonsContainer}>
          {changed && <button type="submit">Save</button>}
        </div>
      </form>
    </div>
  );
}