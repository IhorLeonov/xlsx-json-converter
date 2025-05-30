"use client";

import Result from "@/components/result";
import UploadForm from "@/components/uploadForm";

import { useState } from "react";

export type Row = Record<string, string | number>;

export type UploadRequest = {
  sheetName: string;
  rows: Row[];
}[];

export default function Home() {
  const [result, setResult] = useState<Row[] | null>(null);

  const handleResult = (data: Row[] | null) => {
    setResult(data);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 md:p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">
          Convert XLSX to JSON
        </h1>

        <p className="text-gray-500 text-sm sm:text-base text-center sm:text-left">
          Upload an XLSX file and convert it to JSON format. The data will be
          displayed below. Make sure your spreadsheet has a header row, as it
          will be used as keys in the JSON output.
        </p>

        <div className="flex w-full flex-col items-center justify-center gap-4">
          <UploadForm handleResult={handleResult} />
          <Result data={result} />
        </div>
      </main>
    </div>
  );
}
