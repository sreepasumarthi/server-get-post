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

  // Function to open the modal for adding a new craft
const openAddCraftModal = () => {
    const addCraftModal = document.getElementById("addCraftModal");
    addCraftModal.style.display = "block";
    
    // Close modal when close button is clicked
    const closeModal = () => {
      addCraftModal.style.display = "none";
    };
    
    // Close modal when close button is clicked
    const closeButton = document.getElementById("addCraftModal").getElementsByClassName("close")[0];
    closeButton.addEventListener("click", closeModal);
    
    // Close modal when clicking outside the modal
    window.addEventListener("click", (event) => {
      if (event.target == addCraftModal) {
        closeModal();
      }
    });
  };
  
  // Event listener for the "+" sign to open the add craft modal
  document.getElementById("addCraftButton").addEventListener("click", openAddCraftModal);