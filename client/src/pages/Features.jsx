import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Image,
  FolderOpen,
  MousePointerClick,
  RotateCcw,
  Download,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <Sparkles className="text-blue-500" />,
    title: "AI Text to Image",
    desc: "Convert simple text prompts into stunning AI-generated images.",
  },
  {
    icon: <Image className="text-purple-500" />,
    title: "High Quality Output",
    desc: "Generate sharp, realistic and visually appealing images.",
  },
  {
    icon: <FolderOpen className="text-green-500" />,
    title: "Personal Gallery",
    desc: "All generated images are saved in your personal gallery.",
  },
  {
    icon: <MousePointerClick className="text-pink-500" />,
    title: "Image Actions",
    desc: "Preview, download, copy prompt or delete images easily.",
  },
  {
    icon: <RotateCcw className="text-orange-500" />,
    title: "Regenerate Images",
    desc: "Generate variations again using the same prompt.",
  },
  {
    icon: <Download className="text-indigo-500" />,
    title: "Multiple Download Formats",
    desc: "Download images in PNG format with one click.",
  },
  {
    icon: <CreditCard className="text-yellow-500" />,
    title: "Credit Based System",
    desc: "Transparent credit usage with Razorpay integration.",
  },
  {
    icon: <ShieldCheck className="text-teal-500" />,
    title: "Secure Authentication",
    desc: "JWT based authentication keeps your account secure.",
  },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 0.8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[80vh] pt-14 px-4 mb-20"
    >
      {/* Heading */}
      <h1 className="text-center text-4xl font-semibold mb-3">
        Features of <span className="text-blue-600">Imagify</span>
      </h1>
      <p className="text-center text-gray-500 mb-14">
        Simple, powerful and user-friendly features designed for everyday creators.
      </p>

      {/* Feature Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {features.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="border rounded-xl p-6 text-left bg-white
                       shadow-sm hover:shadow-xl cursor-pointer"
          >
            <div className="text-3xl mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto mt-20 mb-14">
        <hr className="border-gray-200" />
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Ready to create something amazing?
        </h2>
        <p className="text-gray-500 mb-6">
          Turn your imagination into stunning visuals with Imagify.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-8 py-3 rounded-full
                     hover:bg-gray-800 transition-all"
        >
          Start Creating Images ✨
        </button>
      </div>
    </motion.div>
  );
};

export default Features;
