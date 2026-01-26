const { axiosInstance } = require("./axios");

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