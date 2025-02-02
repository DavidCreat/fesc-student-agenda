import api from './api/axios';

export const fetchUserData = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return {
      success: true,
      data: response.data,
      message: 'User data fetched successfully',
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      success: false,
      data: null,
      message: 'Error al obtener datos del usuario',
    };
  }
}; 