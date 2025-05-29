"use client";
// import { format } from "date-fns";

import { FormEvent, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type Row = {
  date: number;
  email: string;
  name: string;
  number: string;
  secondName: string;
  source: string;
  status: string;
};

type UploadRequest = {
  sheetName: string;
  rows: Row[];
}[];

export default function UploadForm() {
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<Row[] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) return;
    setXlsxFile(file);
  };

  const handlePickImage = () => {
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

      const response = (await uploadRequest.json()) as UploadRequest;

      setJsonData(response?.map((item) => item.rows).flat() || null);

      console.log("response", response);
      setUploading(false);
    } catch (e) {
      console.log("Trouble uploading file", e);
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <form className="flex flex-col">
        <input
          ref={fileInputRef}
          className="sr-only"
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
        />

        <button
          type="button"
          className={twMerge("border w-[140px] rounded-sm p-1 cursor-pointer")}
          onClick={handlePickImage}
        >
          {xlsxFile ? xlsxFile.name : "Upload xlsx file"}
        </button>

        <button
          disabled={!xlsxFile || uploading}
          className="mt-2 w-[140px] border disabled:!border-none disabled:cursor-default cursor-pointer border-black rounded-sm p-1 text-white bg-gray-400"
          onClick={handleConvertToJson}
        >
          Convert to json
        </button>

        {uploading && <p>Uploading...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>

      {jsonData && (
        <>
          <ul className="mt-4">
            {jsonData?.slice(0, 10).map((row) => (
              <li key={row.email}>
                <p className="flex justify-between gap-2">
                  {Array.from(Object.entries(row)).map(([key, value]) => (
                    <span key={key} className="text-sm">
                      {value}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
          <p>.......</p>
        </>
      )}
    </div>
  );
}
