import { motion } from "framer-motion";

interface ParagraphProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export function Paragraph({ isOpen, onClose, content }: ParagraphProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed max-w-[80%] w-full p-6 rounded-2xl max-h-[80vh] overflow-y-auto top-1/2 left-1/2 bg-white flex flex-col items-center justify-center z-50 shadow-2xl"
      >
        <p className="text-xl my-2 font-medium text-black text-left w-full">
          Comprehensive Paragraph
        </p>

        <hr className="h-[0.5px] w-full my-2 bg-slate-200" />

        {/* Paragraph Content */}
        <div
          className="text-slate-700 leading-relaxed mt-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* ActionButton */}
        <div className="w-full self-end max-w-sm mt-10" data-purpose="footer-actions">
          <button
            className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white py-2 rounded-lg font-bold text-lg shadow-lg transition-all transform active:scale-[0.98]"
            data-purpose="done-button"
            onClick={onClose}
          >
            Minimize
          </button>
        </div>
      </motion.div>
    </>
  );
}
