const getCrafts = async () => {
    try {
      return (await fetch("/api/crafts")).json();
    } catch (error) {
      console.log("Error retrieving data:", error);
      return [];
    }
  };
  
  const openModal = (craft) => {
    const modal = document.getElementById("dialog");
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
  
    modalImage.src = craft.image;
  
    modal.style.display = "block";
  
    const closeModal = () => {
      modal.style.display = "none";
    };
  
    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.addEventListener("click", closeModal);
  
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  };
  
  const showCrafts = async () => {
    const crafts = await getCrafts();
    const craftsDiv = document.getElementById("crafts-list");
  
    craftsDiv.innerHTML = "";
  
    crafts.forEach((craft) => {
      const section = document.createElement("section");
      section.classList.add("craft");
      craftsDiv.append(section);
  
      const a = document.createElement("a");
      a.href = "#";
      section.append(a);
  
      const h3 = document.createElement("h3");
      h3.innerHTML = craft.name;
      a.append(h3);
  
      const img = document.createElement("img");
      img.src = craft.image;
      a.append(img);
  
      a.onclick = (e) => {
        e.preventDefault();
        openModal(craft);
      };
    });
  };
  
  const addCraft = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-craft-form");
    const formData = new FormData(form);
  
    formData.append("supplies", getSupplies());
  
    try {
      const response = await fetch("/api/crafts", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Error posting data");
      }
  
      await response.json();
      resetForm();
      document.getElementById("dialog").style.display = "none";
      showCrafts();
    } catch (error) {
      console.error(error);
    }
  };
  
  const getSupplies = () => {
    const inputs = document.querySelectorAll("#supplies-boxes input");
    let supplies = [];
  
    inputs.forEach((input) => {
      supplies.push(input.value);
    });
  
    return supplies.join(",");
  };
  
  const resetForm = () => {
    const form = document.getElementById("add-craft-form");
    form.reset();
    document.getElementById("supplies-boxes").innerHTML = "";
    document.getElementById("img-prev").src = "";
  };
  
  const showCraftForm = (e) => {
    e.preventDefault();
    openDialog("add-craft-form");
    resetForm();
  };
  
  const addSupply = (e) => {
    e.preventDefault();
    const section = document.getElementById("supplies-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
  };
  
  const openDialog = (id) => {
    document.getElementById("dialog").style.display = "block";
    document.querySelectorAll("#dialog-details > *").forEach((item) => {
      item.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
  };
  
  // Initial code
  showCrafts();
  document.getElementById("add-craft-form").onsubmit = addCraft;
  document.getElementById("add-link").onclick = showCraftForm;
  document.getElementById("add-supply").onclick = addSupply;
  
  document.getElementById("img").onchange = (e) => {
    if (!e.target.files.length) {
      document.getElementById("img-prev").src = "";
      return;
    }
    document.getElementById("img-prev").src = URL.createObjectURL(
      e.target.files.item(0)
    );
  };
  
  showCrafts();