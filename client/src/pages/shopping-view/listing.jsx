import React, { use } from 'react';
import ShoppingHeader from '@/components/shopping-view/header';
import ProductFilter from '@/components/shopping-view/filter';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuTrigger, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowUpDownIcon } from 'lucide-react';
import { sortOptions } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { useState, useEffect } from 'react';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { toast } from "sonner";

function createSearchParamsHelper(filterParams) {
    const queryParams = [];
    for(const [key, value] of Object.entries(filterParams)) {
        if(Array.isArray(value) && value.length > 0){
            const paramValue = value.join(',');
            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
        }
    }
    return queryParams.join('&');
}


function ShoppingListing() {
    const dispatch = useDispatch();
    const { productList, productDetails } = useSelector((state) => state.shopProducts);
    const {user} = useSelector(state=> state.auth)
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [openProductDetailsDialog, setOpenProductDetailsDialog] = useState(false);
    

    function handleGetProductDetails(productId){
    dispatch(fetchProductDetails(productId));
}
    
    function handleAddToCart(productId){
        dispatch(addToCart({ userId: user?.userId, productId, quantity: 1 })).then((data)=>{
            {
                if(data.payload.success){
                    dispatch(fetchCartItems(user?.userId));
                    toast.success("Product added to cart successfully");
                }
            }
        });
    }

    function handleSort(value) {
        setSort(value);
        // Implement sorting logic here, possibly dispatching an action to sort products in the store
    }
    function handleFilter(getSectionId, getCurrentOptions){
        let cpFilters ={...filters};
        const indexofCurrentSection = Object.keys(cpFilters).indexOf(getSectionId);
        if(indexofCurrentSection === -1){
            cpFilters = {
                ...cpFilters,
                [getSectionId]: [getCurrentOptions]
            }
        }
        else {
            const indexOfCurrentOption = cpFilters[getSectionId].indexOf(getCurrentOptions);
            if(indexOfCurrentOption === -1){
                cpFilters[getSectionId].push(getCurrentOptions);
            }
            else {
                cpFilters[getSectionId].splice(indexOfCurrentOption, 1);
            }

    }
    setFilters(cpFilters);
    sessionStorage.setItem('Filters', JSON.stringify(cpFilters));
}

    useEffect(() => {
        setSort('price-lowtohigh');
        const storedFilters = sessionStorage.getItem('Filters');

        if (storedFilters) {
            setFilters(JSON.parse(storedFilters || {}));
        }
    }, []);

    useEffect(() => {
        if (productDetails !== null) {
            setOpenProductDetailsDialog(true);
        }
    },[productDetails])

    useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
        const createQueryString = createSearchParamsHelper(filters);
        setSearchParams(new URLSearchParams(createQueryString));
    }
    }, [filters]);

    useEffect(() => {
        if(filters !== null && sort !== null) dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
    }, [dispatch, filters, sort]);
return <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
    <ProductFilter filters={filters} handleFilter={handleFilter} />
    <div className='bg-background w-full rounded-lg shadow-sm'>
        <div className='p-4 border-b flex items-center justify-between'>
            <h2 className='text-lg font-extrabold'>All Products</h2>
            <div className='flex items-center gap-3'>
                <span className='text-muted-foreground'>{productList?.length || 0} Products</span>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm' className='flex items-center gap-1'>
                        <ArrowUpDownIcon className='w-4 h-4'/>
                        <span>Sort By</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className='w-[200px]'>
                    <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                        {
                            sortOptions.map((option) => <DropdownMenuRadioItem value={option.id} key={option.id}>
                                {option.label}
                            </DropdownMenuRadioItem>)
                        }
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
            {
                productList && productList.length >0 ?
                productList.map(productItem=><ShoppingProductTile handleGetProductDetails={handleGetProductDetails} handleAddToCart={handleAddToCart} product={productItem}
                />)
                : null
            }
        </div>
    </div>
    <ProductDetailsDialog open={openProductDetailsDialog} setOpen={setOpenProductDetailsDialog} productDetails={productDetails}/>
</div>
}

export default ShoppingListing;