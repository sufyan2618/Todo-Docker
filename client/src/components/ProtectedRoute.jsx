import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, token, isCheckingAuth, CheckAuth } = useAuthStore();

    useEffect(() => {
        if (token && !isAuthenticated && !isCheckingAuth) {
            CheckAuth();
        }
    }, [token, isAuthenticated, isCheckingAuth, CheckAuth]);



    if (isCheckingAuth) {
        return (
            <div className="list-state" style={{ minHeight: '100vh' }}>
                <div className="spin rounded-full h-8 w-8 border-2 border-[#244cbd] border-t-transparent" role="status" aria-label="Loading your workspace"></div>
            </div>
        );
    }

    if (!isAuthenticated && !token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
