import { getVehicles, getVehicle, addVehicle, updateVehicle, deleteVehicle } from "./api.js";
import { filterVehicles, sortVehicles, findVehicle, hasAvailableVehicles, hasValidPrices } from "./vehicles.js";
import { renderDashboard } from "./dashboard.js";
import { renderVehicles, renderDetails, clearDetails, fillForm, resetForm, showMessage, clearMessage, setLoading, disableButtons } from "./ui.js";

const form = document.getElementById("vehicle-form");
const list = document.getElementById("vehicle-list");
const search = document.getElementById("search");
const brand = document.getElementById("filter-brand");
const status = document.getElementById("filter-status");
const minPrice = document.getElementById("min-price");
const maxPrice = document.getElementById("max-price");
const sort = document.getElementById("sort");
const saveButton = document.getElementById("save-button");
const resetButton = document.getElementById("reset-button");
const cancelButton = document.getElementById("cancel-button");

let allVehicles = [];
let brandVehicles = [];
let busy = false;
let selectedId = null;

function displayVehicles() {
    const filtered = filterVehicles(
        brandVehicles, search.value, brand.value,
        status.value, minPrice.value, maxPrice.value
    );

    renderVehicles(sortVehicles(filtered, sort.value));
}

async function loadVehicles() {
    setLoading(true);
    try {
        allVehicles = await getVehicles();
        brandVehicles = brand.value ? await getVehicles(brand.value) : allVehicles;
        renderDashboard(allVehicles);
        displayVehicles();

        console.log("Available vehicles exist:", hasAvailableVehicles(allVehicles));
        console.log("All prices valid:", hasValidPrices(allVehicles));
    } finally {
        setLoading(false);
    }
}

async function loadBrand() {
    setLoading(true);
    clearMessage();
    try {
        brandVehicles = brand.value ? await getVehicles(brand.value) : allVehicles;
        displayVehicles();
    } catch (error) {
        showMessage("error", error.message);
        renderVehicles([]);
    } finally {
        setLoading(false);
    }
}

function getFormVehicle() {
    return {
        brand: document.getElementById("vehicle-brand").value,
        model: document.getElementById("vehicle-model").value.trim(),
        year: Number(document.getElementById("vehicle-year").value),
        price: Number(document.getElementById("vehicle-price").value),
        mileage: Number(document.getElementById("vehicle-mileage").value),
        color: document.getElementById("vehicle-color").value.trim(),
        status: document.getElementById("vehicle-status").value
    };
}

form.addEventListener("submit", async event => {
    event.preventDefault();
    if (busy) return;
    if (!form.reportValidity()) return;

    const vehicle = getFormVehicle();
    if (!vehicle.model || !vehicle.color || vehicle.price <= 0 || vehicle.mileage < 0) {
        showMessage("error", "Please enter valid vehicle information.");
        return;
    }

    busy = true;
    disableButtons(true, saveButton, cancelButton, resetButton);
    clearMessage();
    setLoading(true);

    const id = document.getElementById("vehicle-id").value;
    try {
        if (id) {
            await updateVehicle(Number(id), vehicle);
        } else {
            await addVehicle(vehicle);
        }

        resetForm();
        await loadVehicles().catch(error => {
    showMessage("error", error.message);
    renderVehicles([]);
    renderDashboard([]);
});
        showMessage("success", id ? "Vehicle updated successfully." : "Vehicle added successfully.");
        if (selectedId !== null) {
            const updatedVehicle = findVehicle(allVehicles, selectedId);
            if (updatedVehicle) renderDetails(updatedVehicle);
        }
    } catch (error) {
        showMessage("error", error.message);
    } finally {
        busy = false;
        disableButtons(false, saveButton, cancelButton, resetButton);
        setLoading(false);
    }
});

list.addEventListener("click", async event => {
    const button = event.target.closest("button[data-action]");
    if (!button || busy) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    clearMessage();

    if (action === "edit") {
        const vehicle = findVehicle(allVehicles, id);
        if (vehicle) fillForm(vehicle);
        return;
    }

    if (action === "delete" && !confirm("Delete this vehicle?")) return;

    busy = true;
    setLoading(true);
    try {
        if (action === "details") {
            const vehicle = await getVehicle(id);
            selectedId = id;
            renderDetails(vehicle);
        }
        if (action === "delete") {
            await deleteVehicle(id);
            if (selectedId === id) {
                selectedId = null;
                clearDetails();
            }
            await loadVehicles();
            showMessage("success", "Vehicle deleted successfully.");
        }
    } catch (error) {
        showMessage("error", error.message);
    } finally {
        busy = false;
        setLoading(false);
    }
});

search.addEventListener("input", displayVehicles);
status.addEventListener("change", displayVehicles);
minPrice.addEventListener("input", displayVehicles);
maxPrice.addEventListener("input", displayVehicles);
sort.addEventListener("change", displayVehicles);
brand.addEventListener("change", loadBrand);

resetButton.addEventListener("click", () => {
    search.value = "";
    brand.value = "";
    status.value = "";
    minPrice.value = "";
    maxPrice.value = "";
    sort.value = "";
    brandVehicles = allVehicles;
    clearMessage();
    displayVehicles();
});

cancelButton.addEventListener("click", resetForm);

loadVehicles();
