import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

function Home() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalComments: 0
  });
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await postsAPI.getStats();
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, []);

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/create-post');
    }
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Добро пожаловать в The Blog Times</h1>
        <p>
          Ваш надежный источник актуальных новостей и глубоких аналитических материалов.
          Присоединяйтесь к нашему сообществу авторов и читателей, 
          где каждый голос имеет значение.
        </p>
        <div className="home-actions">
          <button onClick={() => navigate('/posts')} className="btn btn-primary">
            Читать статьи
          </button>
          <button onClick={handleCreatePost} className="btn btn-secondary">
            <span>{isAuthenticated ? 'Написать статью' : 'Войти и написать статью'}</span>
          </button>
        </div>
      </section>

      <div className="section-separator" />

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <i className="fas fa-file-alt"></i>
            <h3>{stats.totalPosts}</h3>
            <p>Публикаций</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <h3>{stats.totalUsers}</h3>
            <p>Пользователей</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-comments"></i>
            <h3>{stats.totalComments}</h3>
            <p>Комментариев</p>
          </div>
        </div>
      </section>

      <div className="section-separator" />

      <section className="features-grid">
        {[
          {
            icon: 'pencil-alt',
            title: 'Создавайте контент',
            description: 'Делитесь своими историями, знаниями и опытом с сообществом'
          },
          {
            icon: 'comments',
            title: 'Общайтесь',
            description: 'Обсуждайте интересные темы и находите единомышленников'
          },
          {
            icon: 'bookmark',
            title: 'Сохраняйте',
            description: 'Сохраняйте понравившиеся статьи и возвращайтесь к ним позже'
          }
        ].map((feature, index) => (
          <div 
            key={index} 
            className="feature-card"
            style={{ '--index': index }}
          >
            <i className={`fas fa-${feature.icon}`}></i>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>

      <div className="section-separator" />

      <section className="why-us-section">
        <h2>Почему выбирают нас</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <i className="fas fa-lock"></i>
            <h3>Безопасность</h3>
            <p>Надежная защита данных и конфиденциальность пользователей</p>
          </div>
          <div className="benefit-card">
            <i className="fas fa-bolt"></i>
            <h3>Скорость</h3>
            <p>Быстрая работа и мгновенная публикация контента</p>
          </div>
          <div className="benefit-card">
            <i className="fas fa-paint-brush"></i>
            <h3>Удобный дизайн</h3>
            <p>Интуитивно понятный интерфейс и приятное оформление</p>
          </div>
          <div className="benefit-card">
            <i className="fas fa-mobile-alt"></i>
            <h3>Адаптивность</h3>
            <p>Удобное использование на любых устройствах</p>
          </div>
        </div>
      </section>

      <div className="section-separator" />

      <section className="cta-section">
        <h2>Готовы начать?</h2>
        <p>Присоединяйтесь к нашему сообществу и делитесь своими историями</p>
        <div className="cta-actions">
          <button onClick={handleCreatePost} className="btn btn-primary">
            <span>Создать первый пост</span>
          </button>
        </div>
      </section>

      <div className="section-separator" />
    </div>
  );
}

export default Home; 