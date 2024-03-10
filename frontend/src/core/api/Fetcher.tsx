
const url = "https://localhost:3000/book1";

export const fetch = async (url: string, options: any = {}) => {
    const response = await window.fetch(url, options);
    const data = await response.json();
    return data;
    }
