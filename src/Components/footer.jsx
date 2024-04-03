import "./footer.css";
const Footer = () => {

    return(
        <div className="footer">
      <ul>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Service</a></li>
        <li><a href="#">Contact Us</a></li>
      </ul>

      

      <ul className="list-unstyled">
              <li>Address:1B,AB,C City</li>
              <li>Phone Number: 123456789</li>
              <li>Email: abc@gmail.com</li>
            </ul>

      <p>Copyright © 2024 My Website. All rights reserved.</p>
        </div>
        
    )
}

export default Footer