import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewPassword() {
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/newpassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, oldPassword, newPassword }),
            });


            const data = await response.json();

            if (response.ok) {
                setSuccess('Password changed successfully!');
                setError('');
                // redirect to login after password change
                setTimeout(() => navigate('/'), 2000);
            } else {
                setError(data.error || 'Failed to change password.');
                setSuccess('');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            setSuccess('');
            console.error(err);
        }
    };

    return (
        <div className="newpassword-container">
            <h2>Change Password</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Old Password:</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Change Password</button>
            </form>
        </div>
    );
}

export default NewPassword;