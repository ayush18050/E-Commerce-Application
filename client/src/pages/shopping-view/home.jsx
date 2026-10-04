import { Button } from "@/components/ui/button";
import bannerone from "../../assets/bannerone.jpg";
import bannertwo from "../../assets/bannertwo.jpg";
import bannerthree from "../../assets/bannerthree.jpg";
import { ChevronLeft, ChevronRight, Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon, } from "lucide-react";
  import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { Toaster, toast } from 'sonner'
import ProductDetailsDialog from '@/components/shopping-view/product-details';


function ShoppingHome() {
    const dispatch = useDispatch();
    const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector(
    (state) => state.auth
  );
  const [openProductDetailsDialog, setOpenProductDetailsDialog] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides=[bannerone,bannertwo,bannerthree];
    const navigate = useNavigate();
    function handleNavigateToListingPage(item, type) {
      sessionStorage.removeItem("Filters");
      const currentFilter={
        [type] : [item.id]
      }
      sessionStorage.setItem("Filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }
  function handleGetProductDetails(productId){
      dispatch(fetchProductDetails(productId));
  }
  function handleAddtoCart(productId){
          dispatch(addToCart({ userId: user?.userId, productId, quantity: 1 })).then((data)=>{
              {
                  if(data.payload.success){
                      dispatch(fetchCartItems(user?.userId));
                      toast.success("Product added to cart successfully");
                  }
              }
          });
      }
    const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];
useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 15000);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);
  useEffect(() => {
          if (productDetails !== null) {
              setOpenProductDetailsDialog(true);
          }
      },[productDetails])
return <div className="flex flex-col min-h-screen">
    
    <div className="relative w-full h-[600px] overflow-hidden">
        {
            slides.map((slide,index)=>(
                <img key={index} src={slide} alt={`Slide ${index}`} className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`} />
            ))
        }
        <Button onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))} variant="outline" size="icon" className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80">
        <ChevronLeft className="w-4 h-4"/></Button>
        <Button onClick={() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))} variant="outline" size="icon" className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80">
        <ChevronRight className="w-4 h-4"/></Button>
    </div>
    <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Shop by category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
            </div>
        </div>
    </section>

    <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Shop by brand</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(brandItem, "brand")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
            </div>
        </div>
    </section>
    <section className="py-12">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Feature Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
            </div>
        </div>
    </section>
    <ProductDetailsDialog open={openProductDetailsDialog} setOpen={setOpenProductDetailsDialog} productDetails={productDetails}/>
</div>
}

export default ShoppingHome;