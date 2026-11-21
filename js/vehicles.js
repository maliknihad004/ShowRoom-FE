export function filterVehicles(vehicles, search, brand, status, minPrice, maxPrice) {
    const searchText = search.toLowerCase().trim();

    return vehicles.filter(vehicle => {
        const matchesSearch = `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchText);
        const matchesBrand = !brand || vehicle.brand === brand;
        const matchesStatus = !status || vehicle.status === status;
        const matchesMin = minPrice === "" || vehicle.price >= Number(minPrice);
        const matchesMax = maxPrice === "" || vehicle.price <= Number(maxPrice);

        return matchesSearch && matchesBrand && matchesStatus && matchesMin && matchesMax;
    });
}

export function sortVehicles(vehicles, sortBy) {
    const sorted = [...vehicles];

    if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sortBy === "year-asc") sorted.sort((a, b) => a.year - b.year);
    if (sortBy === "year-desc") sorted.sort((a, b) => b.year - a.year);

    return sorted;
}

export function findVehicle(vehicles, id) {
    return vehicles.find(vehicle => vehicle.id === id);
}

export function hasAvailableVehicles(vehicles) {
    return vehicles.some(vehicle => vehicle.status === "Available");
}

export function hasValidPrices(vehicles) {
    return vehicles.every(vehicle => vehicle.price > 0);
}

