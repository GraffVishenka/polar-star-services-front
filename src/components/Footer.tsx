const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">IT Support</h3>
          <p className="footer-text">
            Система поддержки IT-инфраструктуры компании
          </p>
        </div>
        <div className="footer-section">
          <h4 className="footer-subtitle">Контакты</h4>
          <p className="footer-text">support@company.com</p>
          <p className="footer-text">+7 (123) 456-78-90</p>
        </div>
        <div className="footer-section">
          <h4 className="footer-subtitle">Режим работы</h4>
          <p className="footer-text">Пн-Пт: 9:00 - 18:00</p>
          <p className="footer-text">Сб-Вс: выходной</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} IT Support. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;