document.addEventListener("DOMContentLoaded", function() {

const getCrafts = async () => {
    try {
        return (await fetch("https://server-get-post-n1ni.onrender.com/api/crafts")).json();
    } catch (error) {
        console.log("error retrieving data");
        return "";
    }
};

const openModal = (craft) => {
    const modal = document.getElementById("myModal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const modalSupplies = document.getElementById("modal-supplies");
    const modalImage = document.getElementById("modal-image");

    modalTitle.innerHTML = `<strong>${craft.name}</strong>`;
    modalDescription.textContent = craft.description;

    modalSupplies.innerHTML = "<strong>Supplies:</strong>";
    craft.supplies.forEach((supply) => {
        const listItem = document.createElement("li");
        listItem.textContent = supply;
        modalSupplies.appendChild(listItem);
    });

    modalImage.src = "https://server-get-post-n1ni.onrender.com/" + craft.img;

    modal.style.display = "block";

    const closeModal = () => {
        modal.style.display = "none";
    };

    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.addEventListener("click", closeModal);

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });
};

const showCrafts = async () => {
    const craftsJSON = await getCrafts();
    const columns = document.querySelectorAll(".column");

    if (craftsJSON == "") {
        columns.forEach(column => {
            column.innerHTML = "Sorry, no crafts";
        });
        return;
    }

    let columnIndex = 0;
    let columnCount = columns.length;
    let columnHeights = Array.from(columns).map(() => 0); // Array to store column heights

    craftsJSON.forEach((craft, index) => {
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        const galleryItem = document.createElement("div");
        galleryItem.classList.add("gallery-item");
        const img = document.createElement("img");
        img.src = "https://server-get-post-n1ni.onrender.com/" + craft.img;
        img.alt = craft.name;
        img.addEventListener("click", () => openModal(craft));
        galleryItem.appendChild(img);
        columns[shortestColumnIndex].appendChild(galleryItem);
        columnHeights[shortestColumnIndex] += galleryItem.offsetHeight;

        // If the column's height exceeds the container's height, switch to the next column
        if (columnHeights[shortestColumnIndex] >= columns[shortestColumnIndex].offsetHeight) {
            columnIndex++;
            if (columnIndex === columnCount) columnIndex = 0;
            columnHeights[shortestColumnIndex] = 0; // Reset the height of the column
        }
    });
};

showCrafts();

const showCraftFormModal = (e) => {
    e.preventDefault();
    resetFormModal();
    openModal("add-craft-modal");
};

const resetFormModal = () => {
    const form = document.getElementById("add-craft-form-modal");
    form.reset();
    document.getElementById("supply-boxes-modal").innerHTML = "";
    document.getElementById("img-prev-modal").src = "";
};

const addSupplyModal = (e) => {
    e.preventDefault();
    const section = document.getElementById("supply-boxes-modal");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
};

const addCraftModal = async(e) => {
    e.preventDefault();
    const form = document.getElementById("add-craft-form-modal");
    const formData = new FormData(form);
    formData.append("supplies", getSuppliesModal());

    const response = await fetch("/api/crafts", {
        method:"POST",
        body:formData
    });

    if(response.status != 200) {
        console.log("there was an error posting");
    }

    await response.json();
    resetFormModal();
    document.getElementById("add-craft-modal").style.display = "none";
    showCrafts();
};

const getSuppliesModal = () => {
    const inputs = document.querySelectorAll("#supply-boxes-modal input");
    const supplies = [];

    inputs.forEach((input) => {
        supplies.push(input.value);
    });
    return supplies;
};

const cancelFormModal = () => {
    resetFormModal();
    document.getElementById("add-craft-modal").style.display = "none";
    showCrafts();
};

document.getElementById("add-link").onclick = showCraftForm;
document.getElementById("add-link-modal").onclick = showCraftFormModal;
document.getElementById("add-supply-modal").onclick = addSupplyModal;
document.getElementById("add-craft-form-modal").onsubmit = addCraftModal;
document.getElementById("cancel-button-modal").onclick = cancelFormModal;
});