import React, { useContext, useState } from 'react'
import Layout from '../../components/layout/Layout'
import HeroSection from '../../components/heroSection/HeroSection'
import Filter from '../../components/filter/Filter'
import ProductCard from '../../components/productCard/ProductCard'
import Track from '../../components/track/Track'
import Testimonial from '../../components/testimonial/Testimonial'
import myContext from '../../context/data/myContext'
import TopProduct from '../../components/TopProduct/TopProduct'
import Banner from '../../components/banner/Banner'
import AOS from "aos";
import "aos/dist/aos.css";
import Services from '../../components/services/Services'

function Home() {

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  const context = useContext(myContext);
  const { product } = context;

  // Filter products to include only those with the "fashion" category
  const topProducts = product.filter(item => item.category.includes('fashion'));
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  return (
    <Layout>
      <HeroSection />
      <Filter
        excludeFashion={true}
        isDropdownVisible={isDropdownVisible}
        setIsDropdownVisible={setIsDropdownVisible}
      />
      <ProductCard isDropdownVisible={isDropdownVisible}  />
      <Banner />
      <TopProduct products={topProducts} />
      <Track />
      <Services />
      <Testimonial />
    </Layout>
  )
}

export default Home