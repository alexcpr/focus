import img from "./assets/img/hero.png";

function Hero() {
  return (
    <section className="hero">
      <HeroText />
      <HeroImg />
    </section>
  );
}

function HeroText() {
  return (
    <div className="hero-text">
      <h1>
        Capturer l'instant avec <span className="color-effect">art</span> &{" "}
        <span className="font-effect">émotion</span>
      </h1>
      <p>
        Découvrez le monde à travers mon objectif. Chaque cliché capture
        l'essence unique de l'instant, figeant les souvenirs pour l'éternité.
        Bienvenue dans l'univers visuel où chaque image raconte une histoire.
        Explorez, ressentez, vivez à travers mes yeux. Bienvenue dans l'art de
        la photographie.
      </p>
    </div>
  );
}

function HeroImg() {
  return <img src={img} alt="Focus hero" />;
}

export default Hero;
