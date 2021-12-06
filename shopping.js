const assets = {
  searchBar: document.querySelector("#searchBar"),
  items: document.querySelector(".items"),
  form: document.querySelector(".shopList"),
  deleteButton: document.querySelector("#deleteBtn"),
  showItems: document.querySelector("#showItems"),
  itemNumber: -1,
  list: [],
};
const saveItem = (list) => {
  localStorage.setItem("list", JSON.stringify(list));
};

assets.form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (assets.searchBar.value === "") {
    alert("Please enter an item");
  } else {
    assets.itemNumber += 1;
    const item = {
      id: assets.itemNumber,
      name: assets.searchBar.value,
      complete: false,
    };
    assets.list.push(item);
    saveItem(assets.list);
    const newItem = document.createElement("div");
    newItem.classList.add("item");
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("name", `item${assets.itemNumber}`);
    checkBox.setAttribute("id", assets.itemNumber);
    const span = document.createElement("span");
    const btn = document.createElement("button");
    btn.classList.add("submit");
    btn.textContent = "+";
    span.textContent = item.name;
    newItem.insertAdjacentElement("afterbegin", checkBox);
    newItem.insertAdjacentElement("beforeend", span);
    newItem.insertAdjacentElement("beforeend", btn);
    assets.items.append(newItem);
    assets.searchBar.value = "";

    checkBox.addEventListener("click", () => {
      if (checkBox.checked) {
        assets.deleteButton.addEventListener("click", () => {
          newItem.style.display = "none";
          let tindex = assets.list.findIndex(function (item) {
            if (item.id == checkBox.id) {
              return assets.list.indexOf(item.id);
            }
          });
          console.log("Index of removed item:", tindex);
          saveItem(assets.list.filter((item, index) => index !== tindex));
        });
      }
    });
  }
});
showItems.addEventListener("click", () => {
  const myCart = localStorage.getItem("list");
  if (myCart !== null) {
    console.log(JSON.parse(myCart));
  } else {
    console.log("Your cart is empty");
  }
});
