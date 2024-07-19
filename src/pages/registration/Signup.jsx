import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import { auth, fireDB, storage } from '../../firebase/FirebaseConfig'; // Import storage from FirebaseConfig
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import Loader from '../../components/loader/Loader';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null); // State to hold the selected image file

  const context = useContext(myContext);
  const { loading, setLoading } = context;

  const signup = async () => {
    setLoading(true);
    if (name === "" || email === "" || password === "") {
      setLoading(false);
      return toast.error("All fields are required");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload image to Firebase Storage if an image is selected
      let imageUrl = null;
      if (image) {
        const storageRef = ref(storage, `user_images/${user.uid}`); // Initialize storageRef properly
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Update user profile with image URL if available
      await updateProfile(user, {
        displayName: name,
        photoURL: imageUrl // If no image is uploaded, this will be null
      });

      // Save user data to Firestore
      const userData = {
        name: name,
        uid: user.uid,
        email: user.email,
        time: Timestamp.now(),
      };
      const userRef = collection(fireDB, "users");
      await addDoc(userRef, userData);

      toast.success("Signup Successful");
      setName("");
      setEmail("");
      setPassword("");
      setImage(null);
      setLoading(false);

      // Redirect user to login page after successful signup
      setTimeout(() => {
        window.location.href = '/login';
      }, 800);

    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Signup Failed");
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  }

  return (
    <div className=' flex justify-center items-center h-screen'>
      {loading && <Loader />}
      <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
        <div className="">
          <h1 className='text-center text-white text-xl mb-4 font-bold'>Signup</h1>
        </div>
        <div>
          <input type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name='name'
            className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
            placeholder='Name'
          />
        </div>

        <div>
          <input type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name='email'
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

        {/* Image upload input field */}
        <div>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
          />
        </div>

        <div className=' flex justify-center mb-3'>
          <button
            onClick={signup}
            className=' bg-red-500 w-full text-white font-bold  px-2 py-2 rounded-lg'>
            Signup
          </button>
        </div>
        <div>
          <h2 className='text-white'>Have an account ?<Link className=' text-red-500 font-bold' to={'/login'}> Login</Link></h2>
        </div>
      </div>
    </div>
  )
}

export default Signup;
