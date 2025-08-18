<<<<<<< Updated upstream
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // The backend expects a 'role', so we'll set a default one.
        const newUser = { username, gmail, password, role: 'USER' };

        try {
            const response = await axios.post('http://localhost:8082/api/auth/register', newUser);

            // On success, the backend returns "User Registered Successfully"
            alert(response.data);
            navigate('/login'); // Redirect to login page after successful registration

        } catch (err) {
            // Your backend returns "Gmail Already Exists" with a 409 status
            if (err.response && err.response.status === 409) {
                setError('This email address is already registered.');
            } else {
                setError('An error occurred during registration.');
            }
            console.error('Registration error', err);
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '5rem auto', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '12px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Username</label>
                    <input
                        type="text"
                        className="search-input"
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }}
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label>
                    <input
                        type="email"
                        className="search-input"
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }}
                        placeholder="your.email@example.com"
                        value={gmail}
                        onChange={(e) => setGmail(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label>Password</label>
                    <input
                        type="password"
                        className="search-input"
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none' }}>
                    Register
                </button>
                 <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Already have an account? <Link to="/login" style={{ color: '#10b981' }}>Login here</Link>
                </p>
            </form>
        </div>
    );
};

=======
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // The backend expects a 'role', so we'll set a default one.
        const newUser = { username, gmail, password, role: 'USER' };

        try {
            const response = await axios.post('http://localhost:8082/api/auth/register', newUser);

            // On success, the backend returns "User Registered Successfully"
            alert(response.data);
            navigate('/login'); // Redirect to login page after successful registration

        } catch (err) {
            // Your backend returns "Gmail Already Exists" with a 409 status
            if (err.response && err.response.status === 409) {
                setError('This email address is already registered.');
            } else {
                setError('An error occurred during registration.');
            }
            console.error('Registration error', err);
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '5rem auto', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '12px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Username</label>
                    <input
                        type="text"
                        className="search-input"
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }}
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label>
                    <input
                        type="email"
                        className="search-input"
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }}
                        placeholder="your.email@example.com"
                        value={gmail}
                        onChange={(e) => setGmail(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label>Password</label>
                    <input
                        type="password"
                        className="search-input"
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none' }}>
                    Register
                </button>
                 <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Already have an account? <Link to="/login" style={{ color: '#10b981' }}>Login here</Link>
                </p>
            </form>
        </div>
    );
};

>>>>>>> Stashed changes
export default Register;