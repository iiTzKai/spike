import './Header.css';

function Header() {
  return (
    <section className="header-container">
      <div
        onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}
      >
        LOGO
      </div>
      <div className="navigation-container">test</div>
    </section>
  );
}

export default Header;
