import logo from "./assets/glodenlogo.png";

const landingVideo =
  "https://api.modaweekinternational.com/uploads/videos/video-1776802283690.MP4";

function App() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative h-screen min-h-[620px] overflow-hidden">
        <nav className="fixed top-0 z-50 w-full bg-linear-to-b from-black/90 to-transparent">
          <div className="flex h-20 w-full items-center justify-between px-6 sm:px-10 md:px-12">
            <div />

            <a href="#home" aria-label="Amazon Fashion Week home">
              <img
                src={logo}
                alt="Moda Week International"
                className="h-10 md:h-12"
              />
            </a>
          </div>
        </nav>

        <div id="home" className="absolute inset-0 bg-black">
          <video
            src={landingVideo}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-black/45" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-10 md:px-10 md:pb-8">
          <h1 className="max-w-4xl text-4xl leading-tight text-white sm:text-5xl md:text-6xl lg:text-[100px]">
            AFW TABATINGA,
            <br />
            BRAZIL
          </h1>
        </div>
      </section>
    </main>
  );
}

export default App;
