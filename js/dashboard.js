export function getStatistics(vehicles) {
    const stats = vehicles.reduce((result, vehicle) => {
        result.totalVehicles++;
        if (vehicle.status === "Available") result.availableVehicles++;
        if (vehicle.status === "Reserved") result.reservedVehicles++;
        if (vehicle.status === "Sold") result.soldVehicles++;
        result.totalInventoryValue += vehicle.price;
        return result;
    }, {
        totalVehicles: 0,
        availableVehicles: 0,
        reservedVehicles: 0,
        soldVehicles: 0,
        totalInventoryValue: 0
    });

    stats.averagePrice = stats.totalVehicles === 0
        ? 0
        : stats.totalInventoryValue / stats.totalVehicles;

    return stats;
}

export function renderDashboard(vehicles) {
    const stats = getStatistics(vehicles);

    document.getElementById("total-vehicles").textContent = stats.totalVehicles;
    document.getElementById("available-vehicles").textContent = stats.availableVehicles;
    document.getElementById("reserved-vehicles").textContent = stats.reservedVehicles;
    document.getElementById("sold-vehicles").textContent = stats.soldVehicles;
    document.getElementById("total-value").textContent = `${stats.totalInventoryValue.toLocaleString()} NIS`;
    document.getElementById("average-price").textContent = `${stats.averagePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })} NIS`;
}
