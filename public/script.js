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

  // Function to open the add craft modal
const showCraftForm = (e) => {
    e.preventDefault();
    openCraftModal("add-craft-form");
    resetCraftForm();
  };
  
  // Function to add a new craft
  const addCraft = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-craft-form");
    const formData = new FormData(form);
    let response;
    formData.append("supplies", getCraftSupplies());
  
    console.log(...formData);
  
    response = await fetch("/api/crafts", {
      method: "POST",
      body: formData,
    });
  
    // If there is an error posting data
    if (response.status != 200) {
      console.log("Error posting data");
    }
  
    await response.json();
    resetCraftForm();
    document.getElementById("add-craft-modal").style.display = "none";
    showCrafts();
  };
  
  // Function to get craft supplies
  const getCraftSupplies = () => {
    const inputs = document.querySelectorAll("#craft-supply-boxes input");
    let supplies = [];
  
    inputs.forEach((input) => {
      supplies.push(input.value);
    });
  
    return supplies;
  };
  
  // Function to reset the craft form
  const resetCraftForm = () => {
    const form = document.getElementById("add-craft-form");
    form.reset();
    document.getElementById("craft-supply-boxes").innerHTML = "";
    document.getElementById("craft-img-prev").src = "";
  };
  
  // Function to add a new supply field in the craft form
  const addCraftSupply = (e) => {
    e.preventDefault();
    const section = document.getElementById("craft-supply-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
  };
  
  // Function to open the add craft modal
  const openCraftModal = (id) => {
    document.getElementById("add-craft-modal").style.display = "block";
    document.querySelectorAll("#add-craft-details > *").forEach((item) => {
      item.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
  };
  
  // Function to close the add craft modal
  const closeCraftModal = () => {
    document.getElementById("add-craft-modal").style.display = "none";
  };
  
  // Event listeners
  document.getElementById("add-link").onclick = showRecipeForm;
  document.getElementById("add-craft-supply").onclick = addCraftSupply;
  document.getElementById("add-recipe-form").onsubmit = addRecipe;
  document.getElementById("add-craft-form").onsubmit = addCraft;
  document.getElementById("craft-img").onchange = (e) => {
    if (!e.target.files.length) {
      document.getElementById("craft-img-prev").src = "";
      return;
    }
    document.getElementById("craft-img-prev").src = URL.createObjectURL(
      e.target.files.item(0)
    );
  };
  