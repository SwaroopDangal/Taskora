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

export const getGroupById = async (groupId) => {
    const response = await axiosInstance.get(`/group/${groupId}`);
    return response.data;
};

export const updateGroup = async ({ groupId, name, description }) => {
    const response = await axiosInstance.put(`/group/${groupId}`, {
        name,
        description,
    });
    return response.data;
}

export const deleteGroup = async (groupId) => {
    const response = await axiosInstance.delete(`/group/${groupId}`);
    return response.data;
}

export const createProject = async ({
    name,
    description,
    groupId,
    role,
    dueDate,
    status,
    priority,
}) => {
    const response = await axiosInstance.post(`/group/${groupId}/project`, {
        name,
        description,
        role,
        dueDate,
        status,
        priority,
    });
    return response.data;
}

export const getProjects = async (groupId) => {
    const response = await axiosInstance.get(`/group/${groupId}/project`);
    return response.data;
}

export const getProjectById = async (groupId, projectId) => {
    const response = await axiosInstance.get(`/group/${groupId}/project/${projectId}`);
    return response.data;
};

export const updateProject = async ({
    groupId,
    projectId,
    name,
    description,
    dueDate,
    status,
    priority,
}) => {
    const response = await axiosInstance.put(`/group/${groupId}/project/${projectId}`, {
        name,
        description,
        dueDate,
        status,
        priority,
    });
    return response.data;
}

export const deleteProject = async (groupId, projectId) => {
    const response = await axiosInstance.delete(`/group/${groupId}/project/${projectId}`);
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



export const getTasks = async (groupId, projectId) => {
    const response = await axiosInstance.get(`/group/${groupId}/project/${projectId}/task`);
    return response.data;
};

export const getTaskById = async (groupId, projectId, taskId) => {
    const response = await axiosInstance.get(`/group/${groupId}/project/${projectId}/task/${taskId}`);
    return response.data;
};

export const updateTask = async ({
    groupId,
    projectId,
    taskId,
    name,
    description,
    dueDate,
    status,
    priority,
    assignedTo,
}) => {
    const response = await axiosInstance.put(`/group/${groupId}/project/${projectId}/task/${taskId}`, {
        name,
        description,
        dueDate,
        status,
        priority,
        assignedTo,
    });
    return response.data;
}

export const deleteTask = async (groupId, projectId, taskId) => {
    const response = await axiosInstance.delete(`/group/${groupId}/project/${projectId}/task/${taskId}`);
    return response.data;
}



export const getInvitationLink = async (groupId) => {
    const response = await axiosInstance.get(`/group/${groupId}/invite`);
    return response.data;
}

export const acceptInvitation = async (groupId, token) => {
    const response = await axiosInstance.get(`/group/${groupId}/invite/${token}`);
    return response.data;
}