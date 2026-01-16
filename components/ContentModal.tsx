"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Play } from "lucide-react"

interface ContentModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: React.ReactNode
  videoPlaceholder?: boolean
}

export default function ContentModal({
  isOpen,
  onClose,
  title,
  content,
  videoPlaceholder = false,
}: ContentModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center group"
              >
                <X className="w-6 h-6 text-white/80 group-hover:text-white" />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="p-8 md:p-12">
                  {/* Video Placeholder */}
                  {videoPlaceholder && (
                    <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 mb-8 overflow-hidden group cursor-pointer">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                          <Play className="w-10 h-10 text-white fill-white ml-1" />
                        </div>
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white/80 text-sm">
                        Clique para assistir
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    {title}
                  </h2>

                  {/* Content */}
                  <div className="text-lg text-zinc-400 leading-relaxed space-y-4">
                    {content}
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none"
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
