const list = document.getElementById("vehicle-list");
const details = document.getElementById("vehicle-details");
const message = document.getElementById("message");
const form = document.getElementById("vehicle-form");

export function renderVehicles(vehicles) {
    document.getElementById("empty-message").hidden = vehicles.length > 0;

    list.innerHTML = vehicles.map(vehicle => {
        const { id, brand, model, year, price, mileage, status } = vehicle;

        return `
            <article class="vehicle-card">
                <h3>${brand} ${model}</h3>
                <p>Year: ${year}</p>
                <p>Price: ${price.toLocaleString()} NIS</p>
                <p>Mileage: ${mileage.toLocaleString()} km</p>
                <p>Status: ${status}</p>
                <div class="actions">
                    <button type="button" data-action="details" data-id="${id}">Details</button>
                    <button type="button" data-action="edit" data-id="${id}">Edit</button>
                    <button type="button" class="delete" data-action="delete" data-id="${id}">Delete</button>
                </div>
            </article>
        `;
    }).join("");
}

export function renderDetails(vehicle) {
    const { id, brand, model, year, price, mileage, color, status } = vehicle;

    details.innerHTML = `
        <p><strong>ID:</strong> ${id}</p>
        <p><strong>Brand:</strong> ${brand}</p>
        <p><strong>Model:</strong> ${model}</p>
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Price:</strong> ${price.toLocaleString()} NIS</p>
        <p><strong>Mileage:</strong> ${mileage.toLocaleString()} km</p>
        <p><strong>Color:</strong> ${color}</p>
        <p><strong>Status:</strong> ${status}</p>
    `;
}

export function clearDetails() {
    details.textContent = "Select a vehicle to view its details.";
}

export function fillForm(vehicle) {
    document.getElementById("vehicle-id").value = vehicle.id;
    document.getElementById("vehicle-brand").value = vehicle.brand;
    document.getElementById("vehicle-model").value = vehicle.model;
    document.getElementById("vehicle-year").value = vehicle.year;
    document.getElementById("vehicle-price").value = vehicle.price;
    document.getElementById("vehicle-mileage").value = vehicle.mileage;
    document.getElementById("vehicle-color").value = vehicle.color;
    document.getElementById("vehicle-status").value = vehicle.status;
    document.getElementById("save-button").textContent = "Update Vehicle";
    document.getElementById("cancel-button").hidden = false;
}

export function resetForm() {
    form.reset();
    document.getElementById("vehicle-id").value = "";
    document.getElementById("save-button").textContent = "Add Vehicle";
    document.getElementById("cancel-button").hidden = true;
}

export function showMessage(type, text) {
    message.textContent = text;
    message.className = `notice ${type}`;
    message.hidden = false;
}

export function clearMessage() {
    message.hidden = true;
    message.textContent = "";
}

export function setLoading(loading) {
    document.getElementById("loading").hidden = !loading;
}

export function disableButtons(disabled, ...buttons) {
    buttons.forEach(button => button.disabled = disabled);
}
