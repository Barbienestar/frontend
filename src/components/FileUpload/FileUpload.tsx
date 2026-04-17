import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { useState, useCallback } from "react";

type FileUploadVariant = "receta" | "csv"

interface FileUploadProps {
    variant?: FileUploadVariant;
    text: string;
    onFileChange?: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ variant = "receta", text, onFileChange }: FileUploadProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            onFileChange?.(droppedFile);
        }
    }, [onFileChange]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            onFileChange?.(selectedFile);
        }
    }, [onFileChange]);

    if (variant === "csv") {
        return (
            <Card
                className={`border-2 border-dashed transition-colors cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-muted"
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-muted-foreground mb-2">
                        {file ? file.name : "Drag & drop your CSV file here"}
                    </div>
                    <div className="text-sm text-muted-foreground">or</div>
                    <Input
                        type="file"
                        accept=".csv"
                        className="mt-2 w-auto cursor-pointer"
                        onChange={handleInputChange}
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <Field>
            <FieldLabel htmlFor="picture">{text}</FieldLabel>
            <Input id="picture" type="file" accept="image/*" onChange={handleInputChange} />
            <FieldDescription>Selecciona una imagen para subir a tu reporte.</FieldDescription>
        </Field>
    )
}

export default FileUpload;
