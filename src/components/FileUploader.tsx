import { useState } from "react";
import { Upload } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataRow } from "@/types/data";
import { toast } from "sonner";

interface FileUploaderProps {
  onDataLoaded: (data: DataRow[]) => void;
}

export const FileUploader = ({ onDataLoaded }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateData = (rows: any[]): DataRow[] => {
    return rows
      .filter((row) => row.id && row.sku && row.name)
      .map((row) => {
        let validDate = new Date().toISOString().split("T")[0];
        if (row.created) {
          const parsedDate = new Date(row.created);
          if (!isNaN(parsedDate.getTime())) {
            validDate = parsedDate.toISOString().split("T")[0];
          }
        }
        
        const price = Number(row.price) || 0;
        const costPrice = Number(row["cost price"] || row.costPrice || price / 1.5);
        const profit = Number(row.profit || price - costPrice);
        
        return {
          id: String(row.id),
          sku: String(row.sku),
          name: String(row.name),
          quantity: Number(row.quantity) || 0,
          price,
          costPrice,
          profit,
          created: validDate,
          total: Number(row["total revenue"] || row.total || Number(row.quantity) * price),
        };
      });
  };

  const handleFile = (file: File) => {
    setIsLoading(true);
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const validatedData = validateData(results.data);
          if (validatedData.length > 0) {
            onDataLoaded(validatedData);
            toast.success(`Loaded ${validatedData.length} rows successfully`);
          } else {
            toast.error("No valid data found in CSV");
          }
          setIsLoading(false);
        },
        error: (error) => {
          toast.error(`CSV parsing error: ${error.message}`);
          setIsLoading(false);
        },
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          const validatedData = validateData(jsonData);
          if (validatedData.length > 0) {
            onDataLoaded(validatedData);
            toast.success(`Loaded ${validatedData.length} rows successfully`);
          } else {
            toast.error("No valid data found in Excel file");
          }
        } catch (error) {
          toast.error("Error parsing Excel file");
        }
        setIsLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("Please upload a CSV or XLSX file");
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Card
      className={`p-12 border-2 border-dashed transition-all duration-300 shadow-elegant hover:shadow-glow ${
        isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/20 p-6 shadow-glow">
          <Upload className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Upload your data file</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop or click to browse for CSV or XLSX files
          </p>
        </div>
        <label htmlFor="file-upload">
          <Button disabled={isLoading} asChild size="lg">
            <span className="cursor-pointer">
              {isLoading ? "Processing..." : "Choose File"}
            </span>
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>
    </Card>
  );
};
