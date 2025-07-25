import React from 'react'

const LoginPage = () => {
  return (
     <div className="construction-container">
      <div className="construction-content">
        <div className="construction-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 7h-4V5l-2-2h-4L8 5v2H4c-1.1 0-2 .9-2 2v5c0 .75.4 1.38 1 1.73V19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-3.28c.59-.35 1-.99 1-1.72V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zM4 9h16v5h-5v-3H9v3H4V9zm9 6h-2v-2h2v2zm6 4H5v-3h4v1h6v-1h4v3z" />
          </svg>
        </div>
        <h1 className="construction-title">Страница в разработке</h1>
        <p className="construction-text">
          Мы активно работаем над созданием этой страницы. Пожалуйста, зайдите позже.
        </p>
        <div className="construction-progress">
          <div className="progress-bar">
            <div className="progress" style={{ width: '65%' }}></div>
          </div>
          <span className="progress-text">65% завершено</span>
        </div>
        <a href="/" className="construction-link">
          Вернуться на главную
        </a>
      </div>
    </div>
  )
}

export default LoginPage