import { useState } from "react";
import { Button } from "@/components/Button/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import type { HospitalData } from "@/common/HospitalData";
import FileUpload from "../FileUpload/FileUpload";

const StockFileUpload = ({ hospitals }: { hospitals: HospitalData[] }) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(
    hospitals.length === 1 ? hospitals[0].id : null,
  );

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId);

  if (hospitals.length === 0) {
    return (
      <div>
        <Badge variant="destructive">No hay hospitales disponibles</Badge>
        <FileUpload variant="csv" text="Sube el archivo CSV con tus datos" />
      </div>
    );
  }

  return (
    <div>
      {hospitals.length === 1 ? (
        <div className="mb-4">
          <Badge variant="secondary">{selectedHospital?.name}</Badge>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              {selectedHospital?.name ?? "Hospitales"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={selectedHospitalId ?? undefined}
              onValueChange={setSelectedHospitalId}
            >
              {hospitals.map((hospital) => (
                <DropdownMenuRadioItem key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <FileUpload variant="csv" text="Sube el archivo CSV con tus datos" />
    </div>
  );
};

export default StockFileUpload;
