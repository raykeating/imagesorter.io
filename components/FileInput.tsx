import { useRef } from 'react';

function FileInput({ handleFileUpload }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="inline-block text-blue-500 hover:text-blue-800 cursor-pointer">
      <span onClick={handleButtonClick} className="text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer">Upload <i className='fa-solid fa-upload'></i></span>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept='image/.jpeg,.jpg,.png'
        onChange={handleFileUpload}
        multiple
      />
    </div>
  );
}

export default FileInput;
