import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase/FirebaseConfig';
import { toast } from 'react-toastify';
import Loader from '../../components/loader/Loader';
import myContext from '../../context/data/myContext';
import { getAuth, confirmPasswordReset } from 'firebase/auth';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const context = useContext(myContext)
    const { loading, setLoading } = context

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        try {
            const oobCode = new URLSearchParams(location.search).get('oobCode'); // Extract oobCode from URL params
            if (!oobCode) {
                toast.error('Invalid or missing reset code.');
                return;
            }

            const auth = getAuth();
            await confirmPasswordReset(auth, oobCode, newPassword);
            toast.success('Password reset successful. You can now log in with your new password.');
            navigate('/login');
        } catch (error) {
            console.error('Error resetting password:', error.code, error.message);
            if (error.code === 'auth/invalid-action-code') {
                toast.error('Invalid or expired reset code. Please request a new reset link.');
            } else {
                toast.error('Failed to reset password. Please try again later.');
            }
        }
    };


    return (
        <div className=' flex justify-center items-center h-screen'>
            {loading && <Loader />}
            <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
                <div className="">
                    <h1 className='text-center text-white text-xl mb-4 font-bold'>Reset Password</h1>
                </div>
                <div>
                    <input type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='new password'
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='confirm new password'
                    />
                </div>
                <div className=' flex justify-center mb-3'>
                    <button
                        onClick={handleResetPassword}
                        className=' bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg'>
                        Reset Passoword
                    </button>
                </div>
            </div>
        </div>

    );
}

export default ResetPassword;
