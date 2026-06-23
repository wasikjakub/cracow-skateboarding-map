import media from "./media.json";
import Footer from "./components/Footer";

export default function Media() {
  return (
    <div className="container">
      <h1 className="main-heading">Polish Skate Media</h1>
      <div className="media-grid">
        {media.map((item) => (
          <div key={item.id} className="media-card">
            <div className="video-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${item.youtubeId}`}
                title={item.description}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="media-description">{item.description}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
