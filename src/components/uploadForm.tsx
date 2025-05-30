"use client";

import { Row, UploadRequest } from "@/app/page";
import { FormEvent, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type UploadFormProps = {
  handleResult: (data: Row[] | null) => void;
};

export default function UploadForm({ handleResult }: UploadFormProps) {
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) return;
    setXlsxFile(file);
  };

  const handleInputClick = () => {
    fileInputRef?.current?.click();
  };

  const handleConvertToJson = async (e: FormEvent) => {
    e.preventDefault();

    if (!xlsxFile) return setError("Please select a file first");

    try {
      setUploading(true);

      const formData = new FormData();
      if (xlsxFile !== null) formData.set("file", xlsxFile);

      const uploadRequest = await fetch("/api/parse-xlsx", {
        method: "POST",
        body: formData,
      });

      if (!uploadRequest.ok) {
        const error = await uploadRequest.json();
        setError("Something went wrong while converting the file");
        console.error(error);
        return;
      }
      const response = (await uploadRequest.json()) as UploadRequest;

      handleResult(response?.map((item) => item.rows).flat() || null);
    } catch (e) {
      console.log("Trouble uploading file", e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="flex flex-col">
      <input
        ref={fileInputRef}
        className="sr-only"
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
      />

      <div className="flex gap-2 items-center justify-center">
        <button
          type="button"
          className={twMerge(
            "border border-gray-400 h-10 w-[140px] rounded-md p-1 cursor-pointer",
            xlsxFile && "bg-green-300 border-none"
          )}
          onClick={handleInputClick}
        >
          {xlsxFile ? xlsxFile.name : "Upload xlsx file"}
        </button>

        <button
          disabled={!xlsxFile || uploading}
          className="h-10 w-[140px] border disabled:!border-none transition-colors text-gray-600 hover:text-black disabled:text-gray-400 disabled:cursor-default cursor-pointer border-gray-400 rounded-md p-1  bg-gray-200"
          onClick={handleConvertToJson}
        >
          Convert to json
        </button>
      </div>

      {uploading && <p className="mt-2 text-center">Processing...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
