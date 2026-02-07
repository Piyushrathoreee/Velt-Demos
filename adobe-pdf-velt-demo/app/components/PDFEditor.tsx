"use client";

import { useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import {
  useVeltClient,
  VeltComments,
  VeltCommentsSidebar,
} from "@veltdev/react";

import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from "lucide-react";
import { Navbar } from "./navbar";
import { LeftToolbar } from "./LeftToolbar";
import { usePDFEditor } from "../context/PDFEditorContext";
import { useTheme } from "../context/ThemeContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFEditor() {
  const { client } = useVeltClient();
  const { theme } = useTheme();

  const {
    pdfFile,
    documentName,
    numPages,
    setNumPages,
    pageNumber,
    zoom,
    goToNextPage,
    goToPreviousPage,
    zoomIn,
    zoomOut,
  } = usePDFEditor();

  const pageWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (client && pdfFile) {
      const docId = documentName || "default-doc-id";
      client.setDocuments([
        {
          id: docId,
          metadata: { documentName: docId, type: "pdf" },
        },
      ]);
      client.setLocation({
        id: `page-${pageNumber}`,
        locationName: `Page ${pageNumber}`,
      });
    }
  }, [client, pdfFile, documentName, pageNumber]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-[#f5f5f5] dark:bg-[#1a1a1a] transition-colors duration-200 overflow-hidden">
      <Navbar />

      <div className="flex items-center justify-between border-b px-4 py-2 bg-white dark:bg-[#2c2c2c] dark:border-[#404040] shadow-sm z-20">
        <div className="flex items-center gap-3">
          <button
            disabled={pageNumber <= 1}
            onClick={goToPreviousPage}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#404040] rounded text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Page {pageNumber} of {numPages}
          </span>
          <button
            disabled={pageNumber >= numPages}
            onClick={goToNextPage}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#404040] rounded text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={zoomOut}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#404040] rounded text-gray-700 dark:text-gray-200"
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-sm font-medium w-12 text-center text-gray-700 dark:text-gray-200">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#404040] rounded text-gray-700 dark:text-gray-200"
          >
            <ZoomIn size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="z-10 h-full">
          <LeftToolbar onAddImage={() => {}} />
        </div>

        <main className="flex-1 overflow-auto bg-gray-100 dark:bg-[#111] relative flex justify-center p-8">
          <div
            ref={pageWrapperRef}
            className="relative h-fit shadow-2xl"
            data-velt-pdf-viewer="true"
          >
            <VeltComments
              textMode={true}
              inlineCommentMode={true}
              darkMode={theme === "dark"}
            />

            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              className="relative"
            >
              <Page
                pageNumber={pageNumber}
                scale={1.4 * zoom}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="pdf-page bg-white"
              />
            </Document>
          </div>
        </main>

        <div className="absolute top-0 right-0 h-full w-fit z-30 pointer-events-none">
          <div className="pointer-events-auto h-full">
            <VeltCommentsSidebar darkMode={theme === "dark"} />
          </div>
        </div>
      </div>
    </div>
  );
}
