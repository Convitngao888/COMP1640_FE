import "./header.css";
const Header = () => {

    return(
        <div className="header">
             <img src="https://i.imgur.com/hnlw6df.jpeg" alt="Logo" className="logo" />
             <nav>
             <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/portfolio">Portfolio</a></li>
              <li><a href="/contact">Contact</a></li>
             </ul>   
             </nav>
             <div className="nav">
                <a href="/logout">Log out</a>
             </div>
        </div>
              
    )
}

export default Header;