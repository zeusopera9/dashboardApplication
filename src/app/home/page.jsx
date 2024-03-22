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
            MyApp
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
          <h1 className="home__title">My Application</h1>
          <div className="home__img">
            <Image src={expense} alt="Expense Tracker" className='img'/>
          </div>
          <div className="home__information">
            <h2 className="home__subtitle">My App<p>Expense Tracker</p></h2>
            <p className="home__description">Lorem ipsum dolor sit amet consect  adipiscing elit, commodo tristique id quisque lobortis facilisi feugiat</p>
          </div>
          <div className="box">
            <div class="box__content box__medium">
                <ion-icon name="cash-outline" className="icon-box"></ion-icon>
                <h3 className="box__medium-title inline">3.7</h3>
                <span className="box__medium-description block">Sec.</span>
                <span className="box__medium-detail">0-100 km/h</span>
            </div>
            <div>
                <div className="box__content box__small">
                    <ion-icon name="trending-up-outline" className="icon-box icon-box--small"></ion-icon>
                    <h3 class="box__small-title inline">325</h3>
                    <span class="box__small-description block">km/h</span>
                    <span class="box__small-detail">Top Speed</span>
                </div>
                <div className="box__content box__small">
                    <ion-icon name="phone-portrait-outline" className="icon-box icon-box--small"></ion-icon>
                    <h3 className="box__small-title inline">8.000</h3>
                    <span className="box__small-description block">r.p.m</span>
                    <span className="box__small-detail">Power</span>
                </div>
            </div>
          </div>
        </div>
      </main>

      <script src={main} />

    </div>
  );
}

export default HomePage;
