import api from "@/services/api";

export const uploadMedicineStock = async (idHospital: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(
        `/medicines/upload-stock/${idHospital}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );

    return response.data;
};