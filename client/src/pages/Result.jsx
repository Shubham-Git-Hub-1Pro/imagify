import React, { useContext, useEffect, useState, useRef } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { loadImage } from "canvas";
import { useNavigate } from "react-router-dom";

// Chevron icon
const ChevronIcon = ({ open }) => (
  <svg
    className={`h-5 transition-transform ${open ? "rotate-180" : ""}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

// Custom Dropdown
const CustomDropdown = ({ format, setFormat, formats }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-transparent w-40 border border-zinc-900 text-black px-8 py-3 rounded-full"
      >
        <div className="flex justify-between">
          <p>{format}</p>
          <ChevronIcon open={open} />
        </div>
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-40 bg-white border rounded-xl shadow"
        >
          {formats.map((fmt) => (
            <div
              key={fmt}
              onClick={() => {
                setFormat(fmt);
                setOpen(false);
              }}
              className="px-8 py-3 hover:bg-zinc-200 cursor-pointer text-center"
            >
              {fmt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Result = () => {
  const { generateImage, credit } = useContext(AppContext);
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [format, setFormat] = useState("PNG");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // 🔒 CREDIT SAFETY NET
    if (credit <= 0) {
      navigate("/buy");
      return;
    }

    if (!input) return;

    setLoading(true);

    const generatedImage = await generateImage(input);

    if (generatedImage) {
      setImage(generatedImage);

      // ✅ PERSIST IMAGE TO GALLERY (localStorage)
      const existingGallery =
        JSON.parse(localStorage.getItem("galleryImages")) || [];

      const newImage = {
        id: Date.now(),
        url: generatedImage,
        prompt: input,
      };

      localStorage.setItem(
        "galleryImages",
        JSON.stringify([newImage, ...existingGallery])
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const convertImage = async (input, format) => {
    const img = await loadImage(input);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const ext = format.toLowerCase();

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `image.${ext}`;
      link.click();
      URL.revokeObjectURL(url);
    }, `image/${ext}`);
  };

  return (
    <motion.form
      onSubmit={onSubmitHandler}
      initial={{ opacity: 0.2, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col min-h-[90vh] justify-center items-center"
    >
      {/* IMAGE */}
      <div className="mb-6">
        <img
          src={image || assets.sample_img_1}
          alt="generated"
          className="max-w-sm rounded"
        />
        {loading && (
          <p className="text-center mt-2">Generating...</p>
        )}
      </div>

      {/* INPUT */}
      {!image && credit > 0 && (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white p-1 rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to generate"
            className="flex-1 bg-transparent outline-none ml-6"
          />
          <button className="bg-zinc-900 px-10 py-3 rounded-full">
            Generate
          </button>
        </div>
      )}

      {/* CREDIT EXHAUSTED */}
      {!image && credit <= 0 && (
        <div className="text-center">
          <p className="text-red-600 mb-4 font-medium">
            You have exhausted your credits.
          </p>
          <button
            type="button"
            onClick={() => navigate("/buy")}
            className="bg-zinc-900 text-white px-10 py-3 rounded-full"
          >
            Buy Credits
          </button>
        </div>
      )}

      {/* ACTIONS */}
      {image && (
        <div className="flex flex-col items-center mt-8 gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setImage(null);
                setInput("");
              }}
              type="button"
              className="border border-zinc-900 px-8 py-3 rounded-full"
            >
              Generate Another
            </button>

            <CustomDropdown
              format={format}
              setFormat={setFormat}
              formats={["JPEG", "PNG", "WebP"]}
            />
          </div>

          <button
            onClick={() => convertImage(image, format)}
            type="button"
            className="bg-zinc-900 text-white px-10 py-3 rounded-full"
          >
            Download
          </button>
        </div>
      )}
    </motion.form>
  );
};

export default Result;
