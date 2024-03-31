// Function to fetch crafts data from the server
const getCrafts = async () => {
    try {
      return (await fetch("https://server-get-post-n1ni.onrender.com/api/crafts")).json();
    } catch (error) {
      console.log("error retrieving data");
      return "";
    }
  };
  
  // Function to open the modal with craft details
  const openModal = (craft) => {
    // Get modal elements
    const modal = document.getElementById("myModal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const modalSupplies = document.getElementById("modal-supplies");
    const modalImage = document.getElementById("modal-image");
  
    // Set modal content with craft details
    modalTitle.innerHTML = `<strong>${craft.name}</strong>`;
    modalDescription.textContent = craft.description;
  
    // Set modal supplies list
    modalSupplies.innerHTML = "<strong>Supplies:</strong>";
    craft.supplies.forEach((supply) => {
      const listItem = document.createElement("li");
      listItem.textContent = supply;
      modalSupplies.appendChild(listItem);
    });
  
    // Set modal image
    modalImage.src = "https://server-get-post-n1ni.onrender.com/" + craft.img;
  
    // Display modal
    modal.style.display = "block";
  
    // Function to close the modal
    const closeModal = () => {
      modal.style.display = "none";
    };
  
    // Event listener for close button
    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.addEventListener("click", closeModal);
  
    // Event listener to close modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
      if (event.target == modal) {
        closeModal();
      }
    });
  };
  
  // Function to fetch crafts data and display them
  const showCrafts = async () => {
    const craftsJSON = await getCrafts();
    const columns = document.querySelectorAll(".column");
  
    // Display an error message if no crafts are retrieved
    if (craftsJSON == "") {
      columns.forEach(column => {
        column.innerHTML = "Sorry, no crafts";
      });
      return;
    }
  
    // Variables to manage column layout
    let columnIndex = 0;
    let columnCount = columns.length;
    let columnHeights = Array.from(columns).map(() => 0); // Array to store column heights
  
    // Loop through crafts and display them in columns
    craftsJSON.forEach((craft, index) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      // Create gallery item
      const galleryItem = document.createElement("div");
      galleryItem.classList.add("gallery-item");
      // Create image element
      const img = document.createElement("img");
      img.src = "https://server-get-post-n1ni.onrender.com/" + craft.img;
      img.alt = craft.name;
      img.addEventListener("click", () => openModal(craft)); // Add click event listener to open modal
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
  
  // Function to add a new craft
  const addCraft = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-craft-form");
    const formData = new FormData(form);
  
    // Send POST request to add new craft
    const response = await fetch("https://server-get-post-n1ni.onrender.com/api/crafts", {
      method: "POST",
      body: formData,
    });
  
    // Handle errors
    if (!response.ok) {
      console.log("Error posting data");
      return;
    }
  
    // Reset form and close modal after successful addition
    const result = await response.json();
    console.log(result);
    resetForm();
    document.getElementById("myModal").style.display = "none";
    showCrafts();
  };
  
  // Function to reset form fields
  const resetForm = () => {
    const form = document.getElementById("add-craft-form");
    form.reset();
  };
  
  // Function to show the add craft form in the modal
  const showCraftForm = (e) => {
    e.preventDefault();
    document.getElementById("myModal").style.display = "block";
    resetForm();
  };
  
  // Event listeners
  document.getElementById("add-link").onclick = showCraftForm;
  document.getElementById("add-craft-form").onsubmit = addCraft;
  
  // Initial display of crafts
  showCrafts();
  