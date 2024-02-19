function Gallery() {
  const galleryItems = [];

  for (let i = 0; i < 27; i++) {
    galleryItems.push(
      <div className="gallery-item" key={i}>
        <img src={`https://source.unsplash.com/random?v=${i}`} alt="" />
        <div className="vignette"></div>
      </div>
    );
  }

  return (
    <div className="gallery" id="gallery">
      <div className="gallery-grid">{galleryItems}</div>
    </div>
  );
}

export default Gallery;
