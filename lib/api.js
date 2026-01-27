import { axiosInstance } from "./axios";

export const createGroup = async ({ name, imgUrl, description }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description | "");
    formData.append("imgUrl", imgUrl || "");

    const response = await axiosInstance.post("/group", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const createProject = async ({
    name,
    description,
    groupId,
    role,
    dueDate,
    status,
    priority,
}) => {
    const response = await axiosInstance.post(`/group/${groupId}`, {
        name,
        description,
        role,
        dueDate,
        status,
        priority,
    });
    return response.data;
}
