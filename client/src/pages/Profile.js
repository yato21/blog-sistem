import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';
import PostCard from '../components/PostCard';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalComments: 0
  });
  const [profileData, setProfileData] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'all',
    tag: '',
    sortBy: 'newest'
  });

  useEffect(() => {
    // Если пользователь авторизован, перенаправляем на его профиль с id
    if (user) {
      navigate(`/profile/${user.id}`);
    }
  }, [user, navigate]);

  // Возвращаем загрузку пока идет редирект
  return (
    <div className="loading">
      <i className="fas fa-spinner fa-spin"></i>
      <p>Загрузка профиля...</p>
    </div>
  );
}

export default Profile; 