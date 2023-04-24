import React from 'react'
import Photo from '../types/Photo'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default function DownloadButton({ photos }: { photos: Photo[] }) {
    const handleDownload = () => {
        const zip = new JSZip()
        photos.forEach((photo: Photo, index: number) => {
            if (photo.file) {
                zip.file(`${index}.jpg`, photo.file, { binary: true })
            }
        })
        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, 'photos.zip')
        })
    }

  return (
    <div>
        <button onClick={handleDownload} className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Download
        </button>
    </div>
  )
}
