import { Link, useNavigate } from 'react-router-dom'
import myContext from '../../context/data/myContext';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase/FirebaseConfig';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import Loader from '../../components/loader/Loader';
import { fetchSignInMethodsForEmail } from 'firebase/auth';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const context = useContext(myContext)
  const { loading, setLoading } = context

  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      localStorage.setItem('user', JSON.stringify(result.user));
      //console.log(result);
      toast.success('Login Successfully', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      navigate('/');
      setLoading(false);
    } catch (error) {
      toast.error('Login Failed', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setLoading(false);
    }

  }

  const handlePasswordReset = async () => {

    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }

    setLoading(true);

    // Check if the email is registered in Firebase Authentication
    try {
      // Check if the email is registered in Firebase Authentication
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length === 0) {
        // If the email is not registered, display an error message
        toast.error('This email is not registered.');
        setLoading(false)
        return;
      }
    } catch (error) {
      console.error('Error checking email registration:', error);
      toast.error('An error occurred. Please try again later.');
      setLoading(false)
      return;
    }

    const actionCodeSettings = {
      url: 'http://localhost:5174/reset-password', // Your local URL
      handleCodeInApp: true, // Ensures the oobCode is appended to the URL
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      toast.error(`Error sending password reset email: ${error.message}`);
      console.error('Error sending password reset email:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=' flex justify-center items-center h-screen'>
      {loading && <Loader />}
      <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
        <div className="">
          <h1 className='text-center text-white text-xl mb-4 font-bold'>Login</h1>
        </div>
        <div>
          <input type="email"
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
            placeholder='Email'
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
            placeholder='Password'
          />
        </div>
        <div className=' flex justify-center mb-3'>
          <button
            onClick={login}
            className=' bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg'>
            Login
          </button>
        </div>
        <div>
          <h2 className='text-white'>
            Don't have an account? <Link className='text-yellow-500 font-bold' to={'/signup'}>Signup</Link>
          </h2>
          <h2 className='text-white'>
            Forgot your password?{' '}
            <button onClick={handlePasswordReset} className='text-yellow-500 font-bold'>
              Reset Password
            </button>
          </h2>
        </div>
      </div>
    </div>
  )
}

export default Login