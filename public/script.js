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
    img.src = "https://read-server-json-1.onrender.com/" + craft.img;
    img.alt = craft.name;
    img.addEventListener("click", () => openModal(craft));
    galleryItem.appendChild(img);
    columns[shortestColumnIndex].appendChild(galleryItem);
    columnHeights[shortestColumnIndex] += galleryItem.offsetHeight;
    if (columnHeights[shortestColumnIndex] >= columns[shortestColumnIndex].offsetHeight) {
      columnIndex++;
      if (columnIndex === columnCount) columnIndex = 0;
      columnHeights[shortestColumnIndex] = 0; 
    }
  });
  };
  
  const openAddCraftModal = () => {
    const addCraftModal = document.getElementById("add-craft-modal");
    addCraftModal.style.display = "block";
  };
  
  const closeAddCraftModal = () => {
    const addCraftModal = document.getElementById("add-craft-modal");
    addCraftModal.style.display = "none";
  };
  
  const addCraft = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-craft-form");
    const formData = new FormData(form);
    let response;
    formData.append("supplies", getSupplies());
  
    response = await fetch("/api/crafts", {
      method: "POST",
      body: formData,
    });
  
    if (response.status !== 200) {
      console.log("Error posting data");
    }
  
    await response.json();
    closeAddCraftModal();
    showCrafts();
  };
  
  const getSupplies = () => {
    const inputs = document.querySelectorAll("#supply-boxes input");
    let supplies = [];
  
    inputs.forEach((input) => {
      supplies.push(input.value);
    });
  
    return supplies.join(",");
  };
  
  const resetForm = () => {
    const form = document.getElementById("add-craft-form");
    form.reset();
    document.getElementById("supply-boxes").innerHTML = "";
  };
  
  const showAddCraftForm = (e) => {
    e.preventDefault();
    openAddCraftModal();
    resetForm();
  };
  
  const addSupply = (e) => {
    e.preventDefault();
    const section = document.getElementById("supply-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
  };
  
  window.onload = () => {
    showCrafts();
    document.getElementById("add-craft-form").onsubmit = addCraft;
    document.getElementById("add-craft-link").onclick = showAddCraftForm;
    document.getElementById("add-supply").onclick = addSupply;
  };
  
  document.getElementById("img").onchange = (e) => {
    if (!e.target.files.length) {
      document.getElementById("img-prev").src = "";
      return;
    }
    document.getElementById("img-prev").src = URL.createObjectURL(
      e.target.files.item(0)
    );
  };
  }