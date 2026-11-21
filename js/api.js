const API_URL = "http://localhost:3000/vehicles";

async function request(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Accept": "application/json",
                ...(options.body ? { "Content-Type": "application/json" } : {})
            }
        });

        if (!response.ok) {
            if (response.status === 400) throw new Error("400: Bad request.");
            if (response.status === 401) throw new Error("401: Unauthorized.");
            if (response.status === 404) throw new Error("404: Vehicle not found.");
            if (response.status === 500) throw new Error("500: Server error.");
            throw new Error(`Request failed (${response.status}).`);
        }

        if (response.status === 204) return null;
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error("Network error: Make sure JSON Server is running.");
        }
        throw error;
    }
}

export function getVehicles(brand = "") {
    const url = brand ? `${API_URL}?brand=${encodeURIComponent(brand)}` : API_URL;
    return request(url);
}

export function getVehicle(id) {
    return request(`${API_URL}/${id}`);
}

export function addVehicle(vehicle) {
    return request(API_URL, {
        method: "POST",
        body: JSON.stringify(vehicle)
    });
}

export function updateVehicle(id, vehicle) {
    return request(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ id, ...vehicle })
    });
}

export function deleteVehicle(id) {
    return request(`${API_URL}/${id}`, { method: "DELETE" });
}
