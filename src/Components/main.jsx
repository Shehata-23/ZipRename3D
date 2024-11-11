"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Biohazard, X, Rocket, Star, Globe } from "lucide-react";

export default function CosmicFileTransfer() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleFileChange = useCallback((event) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
      setFileInputKey(Date.now());
    }
  }, []);

  const handleDragEnter = useCallback((event) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  }, []);

  const handleDownload = useCallback(() => {
    selectedFiles.forEach((selectedFile) => {
      const fileNameWithoutOrder = selectedFile.name.replace(
        /^order[_\s]?/i,
        ""
      );
      const newFileName =
        fileNameWithoutOrder.replace(/\.[^/.]+$/, "") + ".zip";
      const blob = new Blob([selectedFile], { type: "application/zip" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = newFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }, [selectedFiles]);

  const removeFile = useCallback((index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-gradient-to-b from-purple-900 via-indigo-900 to-black pt-16">
      <motion.div
        className="absolute top-0 left-0 right-0 z-50 bg-indigo-300/20 py-2 overflow-hidden"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: [0, -1600],
            transition: {
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 50,
                ease: "linear",
              },
            },
          }}
        >
          {[...Array(10)].map((_, index) => (
            <div key={index} className="flex justify-center items-center">
              <Biohazard className="w-6 h-6 text-white mr-2" />
              <span className="text-2xl font-bold text-white mx-4 flex align-center justify-center">
                Please Quit Using IQOS
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {[...Array(90)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0.5, scale: 0 }}
            animate={{
              opacity: Math.random(),
              scale: Math.random() * 0.9 + 0.5,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Star className="text-yellow-200" size={Math.random() * 4 + 2} />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 bg-opacity-20 bg-blue-900 backdrop-filter backdrop-blur-lg rounded-3xl p-8 max-w-md w-full mx-4 mb-8 border border-blue-500 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-200">
          Cosmic File Transfer
        </h2>
        <div
          className={`border-2 border-dashed rounded-xl p-8 transition-colors ${
            isDragging
              ? "border-green-400 bg-green-900 bg-opacity-30"
              : "border-blue-400"
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileInput"
            key={fileInputKey}
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Rocket className="w-16 h-16 text-blue-300 mb-2 animate-bounce" />
            <span className="text-sm text-blue-200 text-center">
              Launch your files into space or click to select
            </span>
            <p className="text-blue-200 text-center mt-4">
              Tip: You can also drag and drop files directly into the cosmic
              upload zone!
            </p>
          </label>
        </div>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.7 }}
            className="mt-4"
          >
            <h2 className="text-lg font-semibold mb-2 text-blue-200">
              Files in Orbit:
            </h2>
            <ul className="space-y-2">
              {selectedFiles.map((file, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between bg-blue-800 bg-opacity-30 rounded-lg p-2"
                >
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-blue-300 mr-2" />
                    <span className="text-sm text-blue-200 truncate max-w-[200px]">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg
                         hover:from-blue-600 hover:to-purple-700 transition duration-300 flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Beam Files Down to Earth
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
