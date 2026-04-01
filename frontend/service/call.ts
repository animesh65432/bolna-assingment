import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_URL } from "@/config"
import { toast } from "react-toastify";


export async function Call<T, ResponseType>({
    path,
    request,
    suppressError = false,
    headers = {},
    method,
    formDataRequest = false,
    responseType,
    signal
}: {
    path: string;
    request?: T;
    suppressError?: boolean;
    method: "POST" | "GET" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    formDataRequest?: boolean;
    responseType?: "json" | "blob";
    signal?: AbortSignal;
}): Promise<ResponseType> {
    const mergedPath = path.startsWith("https://") ? path : `${API_URL}${path}`;

    const config: AxiosRequestConfig = {
        method,
        url: mergedPath,
        headers: headers || {},
        withCredentials: true,
        responseType: responseType || "json",
        signal: signal
    };

    if (formDataRequest && request instanceof FormData) {
        config.data = request;
    } else if (request && responseType !== "blob") {
        config.data = JSON.stringify(request);
        config.headers = {
            ...config.headers,
            "Content-Type": "application/json",
        };
    }
    else if (request) {
        config.data = request;
    }

    try {
        const response: AxiosResponse<ResponseType> = await axios(config);
        return response.data;
    } catch (error: unknown) {
        const errMsg = "Something went wrong.";
        if (!suppressError) {
            console.error(error);
        }

        if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') {
            throw error;
        }

        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.message) {
                    toast.error(`${error.message}`);
                }
                else {
                    toast.error(`${error.response.data.message}`);
                }
            } else if (error.request) {
                console.error("Error Request:", error.request);
            } else {
                console.error("Error Message:", error.message);
            }
        }

        throw {
            handled: !suppressError,
            wrapped: error instanceof Error ? error.message : errMsg,
        };
    }
}