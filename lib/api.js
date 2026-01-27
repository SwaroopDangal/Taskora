import { axiosInstance } from "./axios";

export const createGroup = async ({ name, imgUrl, description, groupType }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description || "");
    formData.append("imgUrl", imgUrl || "");
    formData.append("groupType", groupType);
    const response = await axiosInstance.post("/group", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getGroups = async () => {
    const response = await axiosInstance.get("/group");
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


export const createTask = async ({
    name,
    description,
    projectId,
    groupId,
    dueDate,
    status,
    priority,
    assignedTo,
}) => {
    const response = await axiosInstance.post(`/group/${groupId}/project/${projectId}`, {
        name,
        description,
        dueDate,
        status,
        priority,
        assignedTo,
    });
    return response.data;
};