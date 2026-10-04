import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { House, Menu, ShoppingCart, User, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { shoppingViewHeaderMenuItems } from '@/config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from "@/store/auth-slice";
import { useDispatch } from 'react-redux';
import UserCartWrapper from './cart-wrapper';
import { fetchCartItems } from '@/store/shop/cart-slice';
import { Label } from '../ui/label';



function HeaderRightContent() {
    const {isAuthenticated, user} = useSelector((state) => state.auth);
    const [openCartSheet, setOpenCartSheet] = React.useState(false);
    const { cartItems } = useSelector((state) => state.shopCart);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    function handleLogout() {
    dispatch(logoutUser());
}

useEffect(()=>{
    dispatch(fetchCartItems(user?.userId));
},[dispatch])
    return <div className='flex lg:items-center lg:flex-row flex-col gap-4'>
        <Sheet open={openCartSheet} onOpenChange={()=> setOpenCartSheet(false)}>
            <Button onClick={() => setOpenCartSheet(true)} variant='outline' size='icon'>
                <ShoppingCart className='h-6 w-6'/>
                <span className='sr-only'>User cart</span>
            </Button>
            <UserCartWrapper setOpenCartSheet={setOpenCartSheet} cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []}/>
        </Sheet>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="bg-black">
                        <AvatarFallback className='bg-black text-white font-extrabold'>{user?.userName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='right' className='w-56'>
                    <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/shop/account')}>
                        <User className='mr-2 h-4 w-4'/> Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick = {handleLogout}>
                        <LogOut className='mr-2 h-4 w-4'/>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>
        </div>
    
}



function MenuItems() {
    const navigate = useNavigate();
    function handleNavigate(getCurrentMenuItem){
    sessionStorage.removeItem('Filters');
    const currentFilter= getCurrentMenuItem.id != 'home' ?
    {
        category : [getCurrentMenuItem.id]
    } : null;
    sessionStorage.setItem('Filters', JSON.stringify(currentFilter));
    navigate(getCurrentMenuItem.path);
}
    return <nav className='flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row'>
        {
            shoppingViewHeaderMenuItems.map((item) => (
                <Label onClick={()=>handleNavigate(item)} key={item.id} className='text-sm font-medium cursor-pointer'>
                    {item.label}
                </Label>
            ))
        }
    </nav>
}

function ShoppingHeader() {
     const {isAuthenticated, user} = useSelector((state) => state.auth);
return (
<header className="sticky top-0 z-40 w-full border-b bg-background">
    <div className='flex h-16 items-center justify-between px-4 md:px-6'>
        <Link to='/shop/home' className='flex items-center gap-2'>
        <House className='h-6 w-6'/>
        <span className='font-bold'>Ecommerce</span>
        </Link>
        <Sheet>
        <SheetTrigger asChild>
            <Button variant='outline' size='icon' className="lg:hidden">
                <Menu className='h-6 w-6'/>
                <span className='sr-only'>Toggle header menu</span>
            </Button>
        </SheetTrigger>
        <SheetContent side='left' className='w-full max-w-5xs'>
            <MenuItems/>
            <HeaderRightContent/>
        </SheetContent>
        </Sheet>
        <div className='hidden lg:block'>
            <MenuItems/>
        </div>
        <div className='hidden lg:block'> <HeaderRightContent/> </div>
        
    </div>
</header>
)
}

export default ShoppingHeader;