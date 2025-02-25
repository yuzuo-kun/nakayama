import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <img src='/nakayama/nakayama.png' alt='なか山のロゴ' />
      <nav>
        <Link to="/recipe">サービスA</Link> | 
        <Link to="/order">サービスB</Link>
      </nav>
    </header>
  );
};

export default Header;