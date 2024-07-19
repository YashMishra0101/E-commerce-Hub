import React, { useEffect, useState } from 'react'
import MyContext from './myContext';
import { auth, fireDB } from '../../firebase/FirebaseConfig';
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, deleteDoc, getDocs, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

function MyState(props) {
  const [mode, setMode] = useState('light');
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = 'rgb(17, 24, 39)';
    }
    else {
      setMode('light');
      document.body.style.backgroundColor = 'white';
    }
  }

  const [products, setProducts] = useState({
    title: null,
    price: null,
    originalPrice:null,
    discountPercentage:null,
    productRating:null,
    imageUrl: null,
    category: null,
    stocks: null,
    description: null,
    time: Timestamp.now(),
    date: new Date().toLocaleString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    )

  })

  // ********************** Add Product Section  **********************
  const addProduct = async () => {
    if (products.title == null || products.price == null || products.originalPrice==null || products.discountPercentage===null || products.productRating==null || products.imageUrl == null || products.category == null || products.stocks == null || products.description == null) {
      return toast.error('Please fill all fields')
    }
    const productRef = collection(fireDB, "products")
    setLoading(true)
    try {
      await addDoc(productRef, products)
      toast.success("Product Add successfully")
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 800)
      getProductData()
      closeModal()
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
    setProducts("")
  }

  const [product, setProduct] = useState([]);

  // ****** get product
  const getProductData = async () => {
    setLoading(true)
    try {
      const q = query(
        collection(fireDB, "products"),
        orderBy("time"),
        // limit(5)
      );
      const data = onSnapshot(q, (QuerySnapshot) => {
        let productsArray = [];
        QuerySnapshot.forEach((doc) => {
          productsArray.push({ ...doc.data(), id: doc.id });
        });
        setProduct(productsArray);
        setLoading(false);
      });
      return () => data;
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }


  const edithandle = (item) => {
    setProducts(item)
  }

  // update product
  const updateProduct = async (item) => {
    setLoading(true)
    try {
      await setDoc(doc(fireDB, "products", products.id), products);
      toast.success("Product Updated successfully")
      getProductData();
      setLoading(false)
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 800)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
    setProducts("")
  }

  //delete product
  const deleteProduct = async (item) => {
    try {
      setLoading(true)
      await deleteDoc(doc(fireDB, "products", item.id));
      toast.success('Product Deleted successfully')
      setLoading(false)
      getProductData()
    } catch (error) {
      console.log(error);
      // toast.success('Product Deleted Falied')
      setLoading(false)
    }
  }

  const [users, setUsers] = useState([]);

  const getUserData = async () => {
    setLoading(true)
    try {
      const result = await getDocs(collection(fireDB, "users"))
      const usersArray = [];
      result.forEach((doc) => {
        usersArray.push(doc.data());
        setLoading(false)
      });
      setUsers(usersArray);
      // console.log(usersArray)
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const [searchkey, setSearchkey] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterPrice, setFilterPrice] = useState('')
  const [cartLength, setCartLength] = useState('')

  const fetchCartItems = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const userCartRef = doc(fireDB, 'userCarts', userId);

    try {
      const userCartDoc = await getDoc(userCartRef);
      if (userCartDoc.exists()) {
        const userCartData = userCartDoc.data();
        console.log('Cart Items:', userCartData.cartItems);
        setCartLength(userCartData.cartItems.length);
      } else {
        console.log('User cart not found');
        setCartLength(0);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }

    // Listen for changes in the user's cart and update cartLength
    const unsubscribe = onSnapshot(userCartRef, (doc) => {
      if (doc.exists()) {
        const userCartData = doc.data();
        console.log('Cart Items (Updated):', userCartData.cartItems);
        setCartLength(userCartData.cartItems.length);
      } else {
        console.log('User cart not found');
        setCartLength(0);
      }
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  };


  useEffect(() => {
    getProductData();
    getUserData();
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User logged in:', user.uid);
        const unsubscribeCart = fetchCartItems(); // Fetch cart items for the logged-in user
        return () => unsubscribeCart(); // Cleanup function to unsubscribe from cart listener
      } else {
        console.log('User not logged in');
        setCartLength(0); // Reset cart length when user logs out
      }
    });

    return () => unsubscribeAuth(); // Cleanup function to unsubscribe from auth listener
  }, []);

  return (
    <MyContext.Provider value={{
      mode, toggleMode, loading, setLoading,
      products, setProducts, addProduct, product,
      edithandle, updateProduct, deleteProduct,
      users, searchkey, setSearchkey, filterType, setFilterType,
      filterPrice, setFilterPrice, cartLength, setCartLength
    }}>
      {props.children}
    </MyContext.Provider>
  )
}

export default MyState