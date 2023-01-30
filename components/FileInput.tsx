import React from "react";

export default function FileInput({ handleFileUpload }: any) {
  return (
    <form id="photo-upload" className="flex flex-col gap-2">
      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="file_input"
        >
          Upload files
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          multiple
          onChange={handleFileUpload}
        />
      </div>
    </form>
  );
}
