<<<<<<< Updated upstream
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            // Your backend is running on port 8080
            const response = await axios.post('http://localhost:8082/api/auth/login', {
                gmail: gmail,
                password: password
            });

            // On success, the backend returns {username, role}
            alert(`Welcome back, ${response.data.username}!`);
            
            // You can store user data in localStorage to use later
            localStorage.setItem('user', JSON.stringify(response.data));

            // Navigate to the homepage after successful login
            navigate('/'); 

        } catch (err) {
            // Your backend returns "Invalid Credentials" with a 401 status
            if (err.response && err.response.status === 401) {
                setError('Invalid email or password. Please try again.');
            } else {
                setError('An error occurred during login. Please try again later.');
            }
            console.error('Login error', err);
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '5rem auto', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '12px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label>
                    <input
                        type="email"
                        className="search-input" // Re-using your CSS class
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
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none' }}>
                    Login
                </button>
                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#10b981' }}>Register here</Link>
                </p>
            </form>
        </div>
    );
};

=======
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            // Your backend is running on port 8080
            const response = await axios.post('http://localhost:8082/api/auth/login', {
                gmail: gmail,
                password: password
            });

            // On success, the backend returns {username, role}
            alert(`Welcome back, ${response.data.username}!`);
            
            // You can store user data in localStorage to use later
            localStorage.setItem('user', JSON.stringify(response.data));

            // Navigate to the homepage after successful login
            navigate('/'); 

        } catch (err) {
            // Your backend returns "Invalid Credentials" with a 401 status
            if (err.response && err.response.status === 401) {
                setError('Invalid email or password. Please try again.');
            } else {
                setError('An error occurred during login. Please try again later.');
            }
            console.error('Login error', err);
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '5rem auto', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '12px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label>
                    <input
                        type="email"
                        className="search-input" // Re-using your CSS class
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
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none' }}>
                    Login
                </button>
                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#10b981' }}>Register here</Link>
                </p>
            </form>
        </div>
    );
};

>>>>>>> Stashed changes
export default Login;