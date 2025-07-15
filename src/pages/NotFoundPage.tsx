import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Страница не найдена</h2>
        <p className="not-found-text">
          Извините, запрашиваемая страница не существует или была перемещена.
        </p>
        <a href="/" className="not-found-link">
          Вернуться на главную
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;