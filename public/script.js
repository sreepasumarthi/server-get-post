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
  
  const addCraft = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-craft-form");
    const formData = new FormData(form);
  
    const response = await fetch("https://server-get-post-n1ni.onrender.com/api/crafts", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      console.log("Error posting data");
      return;
    }
  
    const result = await response.json();
    console.log(result);
    resetForm();
    document.getElementById("myModal").style.display = "none";
    showCrafts();
  };
  
  const resetForm = () => {
    const form = document.getElementById("add-craft-form");
    form.reset();
  };
  
  const showCraftForm = (e) => {
    e.preventDefault();
    document.getElementById("myModal").style.display = "block";
    resetForm();
  };
  
  document.getElementById("add-link").onclick = showCraftForm;
  document.getElementById("add-craft-form").onsubmit = addCraft;
  