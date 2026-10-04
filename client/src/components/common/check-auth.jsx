import { Navigate, useLocation } from 'react-router-dom';


function CheckAuth({ isAuthenticated, user, children }) {
    console.log("Is Authenticated: ", isAuthenticated, "User: ", user);
    const loacation = useLocation();

    if (!isAuthenticated && !(loacation.pathname.includes('/login') || loacation.pathname.includes('/register'))) {
        return <Navigate to="/auth/login"/>;
    }
    if (isAuthenticated && (loacation.pathname.includes('/login') || loacation.pathname.includes('/register'))) {
        if (user?.role === 'admin') {
            return <Navigate to="/admin/dashboard"/>;
        } else {
            return <Navigate to="/shop/home"/>;
        }
    }
    if (isAuthenticated && user?.role !== 'admin' && loacation.pathname.includes('/admin')) {
        return <Navigate to="/unauth-page"/>;
    }
    if (isAuthenticated && user?.role === 'admin' && loacation.pathname.includes('/shop')) {
        return <Navigate to="/admin/dashboard"/>;
    }

    return <>{children}</>

}

export default CheckAuth;