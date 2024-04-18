import Image from 'next/image'; 
import Head from 'next/head'; 
import "@/app/home/assets/css/styles.css"
import "@/app/home/assets/scss/styles.scss"
import expense from "@/app/home/assets/img/expense.png"
import main from "@/app/home/assets/js/main.js"

const HomePage = () => {
  return (
    <div>
      <Head>
        <title>MyApp</title>
        <script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons/ionicons.esm.js" type="module" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js" />
      </Head>

      <header className="header">
        <nav className="nav container">
          <a href="/home" className="nav__logo">
            PaisaDekho
          </a>
          <div className="nav__menu" id="nav-menu">
            <ul className="nav__list">
              <li className="nav__item"><a href="/home" className="nav__link">Home</a></li>
              <li className="nav__item"><a href="/" className="nav__link">Dashboard</a></li>
              <li className="nav__item"><a href="" className="nav__link">About Us</a></li>
              <li className="nav__item"><a href="/login" className="nav__link">Login</a></li>
            </ul>
          </div>
          <div className="nav__toggle" id="nav__toggle">
            <ion-icon name="menu-outline"></ion-icon>
          </div>
        </nav>
      </header>

      <main className="main container">
        <div className="home grid">
          <h1 className="home__title">PaisaDekho</h1>
          <div className="home__img">
            <Image src={expense} alt="Expense Tracker" className='img'/>
          </div>
          <div className="home__information">
            <h2 className="home__subtitle"><p>Expense Tracker</p></h2>
            <p className="home__description"> A collaborative personal finance application :)</p>
          </div>
          
        </div>
      </main>

      <script src={main} />

    </div>
  );
}

export default HomePage;
