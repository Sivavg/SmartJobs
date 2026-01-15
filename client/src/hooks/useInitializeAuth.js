import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setLoading } from '../redux/slices/authSlice';

// Hook to initialize auth state from localStorage
export const useInitializeAuth = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                dispatch(setUser(user));
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                dispatch(setLoading(false));
            }
        } else {
            // No user in localStorage, set loading to false
            dispatch(setLoading(false));
        }
    }, [dispatch]);
};

export default useInitializeAuth;
