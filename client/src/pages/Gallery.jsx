import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(null);

  // LOAD + SORT FAVORITES ON TOP
  useEffect(() => {
    const storedImages =
      JSON.parse(localStorage.getItem("galleryImages")) || [];

    const sortedImages = [...storedImages].sort(
      (a, b) => (b.favorite === true) - (a.favorite === true)
    );

    setImages(sortedImages);
  }, []);

  const toggleFavorite = (id) => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, favorite: !img.favorite } : img
    );

    const sorted = [...updated].sort(
      (a, b) => (b.favorite === true) - (a.favorite === true)
    );

    setImages(sorted);
    localStorage.setItem("galleryImages", JSON.stringify(sorted));
  };

  const deleteImage = (id) => {
    const filtered = images.filter((img) => img.id !== id);
    setImages(filtered);
    localStorage.setItem("galleryImages", JSON.stringify(filtered));
  };

  const copyPrompt = (text) => {
    navigator.clipboard.writeText(text);
    alert("Prompt copied!");
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-[80vh] pt-14 px-6"
    >
      <h1 className="text-center text-3xl font-medium mb-2">
        Your Image Gallery
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Generated images from your imagination ✨
      </p>

      {images.length === 0 && (
        <p className="text-center text-gray-400">
          No images yet. Generate your first image ✨
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative bg-white border rounded-xl overflow-hidden shadow group"
          >
            <img
              src={img.url}
              alt="generated"
              className="w-full h-60 object-cover"
            />

            {/* FAVORITE STAR */}
            <button
              onClick={() => toggleFavorite(img.id)}
              className="absolute top-2 right-2 text-xl z-10"
            >
              {img.favorite ? "⭐" : "☆"}
            </button>

            {/* HOVER ACTIONS */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center gap-3">
              <button
                onClick={() => setPreview(img)}
                className="bg-white px-4 py-1 rounded text-sm"
              >
                Preview
              </button>

              <a
                href={img.url}
                download
                className="bg-white px-4 py-1 rounded text-sm"
              >
                Download
              </a>

              <button
                onClick={() => copyPrompt(img.prompt)}
                className="bg-white px-4 py-1 rounded text-sm"
              >
                Copy Prompt
              </button>

              <button
                onClick={() => deleteImage(img.id)}
                className="bg-red-500 text-white px-4 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>

            <div className="p-3">
              <p className="text-sm text-gray-600 line-clamp-2">
                {img.prompt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* PREVIEW MODAL */}
      {preview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl max-w-lg">
            <img
              src={preview.url}
              alt="preview"
              className="rounded mb-3"
            />
            <p className="text-sm text-gray-600 mb-3">
              {preview.prompt}
            </p>
            <button
              onClick={() => setPreview(null)}
              className="w-full bg-zinc-900 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Gallery;
