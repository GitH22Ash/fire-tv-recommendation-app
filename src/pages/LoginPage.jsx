import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { UserPlus, LogIn, LogOut } from 'lucide-react';

// FIX: Updated props to accept 'showNotificationModal' instead of the old setters
const LoginPage = React.memo(({ setCurrentPage, showNotificationModal }) => { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isSigningUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            // FIX: Use the new function to show a success message
            showNotificationModal("Success", `${isSigningUp ? 'Sign up' : 'Login'} successful!`);
            setCurrentPage('Home');
        } catch (error) {
            // FIX: Use the new function to show an error message
            showNotificationModal("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            // FIX: Use the new function to show a sign-out message
            showNotificationModal("Signed Out", "You have been signed out successfully.");
        } catch (error) {
            showNotificationModal("Error", `Sign out error: ${error.message}`);
        }
    };
    
    // If user is already logged in (and not anonymously)
    if (auth.currentUser && !auth.currentUser.isAnonymous) {
        return (
            <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center p-4 text-white">
                <h1 className="text-3xl font-bold mb-4">Profile</h1>
                <p className="mb-2">Logged in as: {auth.currentUser.email}</p>
                <p className="mb-6 text-sm text-gray-400">User ID: {auth.currentUser.uid}</p>
                <button onClick={handleSignOut} className="w-full max-w-xs bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                    <LogOut size={20} className="mr-2"/> Sign Out
                </button>
                <button onClick={() => setCurrentPage('Home')} className="mt-4 text-red-400 hover:text-red-300">
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">{isSigningUp ? 'Create Account' : 'Welcome Back'}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center">
                        {loading ? 'Processing...' : (isSigningUp ? <><UserPlus size={20} className="mr-2"/>Sign Up</> : <><LogIn size={20} className="mr-2"/>Login</>)}
                    </button>
                </form>
                <button onClick={() => setIsSigningUp(!isSigningUp)} className="mt-6 text-center w-full text-red-400 hover:text-red-300 text-sm">
                    {isSigningUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                </button>
                 <button onClick={() => setCurrentPage('Home')} className="mt-4 text-center w-full text-gray-400 hover:text-gray-300 text-sm">Continue as Guest</button>
            </div>
        </div>
    );
});

export default LoginPage;
