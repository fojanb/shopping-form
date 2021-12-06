const shoppingForm = document.querySelector(".shopping");
const list = document.querySelector(".list");
let items = []; //We need an array to hold our State
// -------------------------------------------------------
function handleSubmit(e) {
  //  In order to not to show our items in URL
  e.preventDefault();
  //  We could write another query selector to grab input value.
  //  However, because the input has a name, it's actually
  //  accessible via the form dot the name of the input.
  const name = e.currentTarget.item.value;
  if (!name) return;
  const item = {
    name: name,
    ID: Date.now(),
    complete: false,
  };
  items.push(item);
  e.currentTarget.item.value = "";
  //   It is not a good practice to bind other handy functions like displayItems() to event handlers.
  //   So that is why I used CustomEvent/dispatchEvent
  //   displayItems();
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}
function displayItems() {
  //   console.log(items);
  let htmlHolder = items
    .map(
      (item) => `<li class="shopping-list">  
                    <div>
                      <input type="checkbox" value="${item.ID}" 
                      ${item.complete ? "checked" : ""}/>
                      <span class="itemName">${item.name}</span>
                    </div>
                    <button aria-label="Remove ${item.ID}" value="${
        item.ID
      }">&times;</button>
                 </li>`
    )
    .join("");
  list.innerHTML = htmlHolder;
}
function mirrorToLocalStorage() {
  console.info("Saving items to localstorage");
  // Save the items to LS
  localStorage.setItem("items", JSON.stringify(items));
}

function restoreFromLocalStorage() {
  console.info("Restoring from LS");
  // Pull the items from LS
  const lsItems = JSON.parse(localStorage.getItem("items"));
  if (lsItems.length !== 0) {
    items.push(...lsItems);
    list.dispatchEvent(new CustomEvent("itemsUpdated"));
  }
  return;
}
function deleteItem(id) {
  console.log("DELETIENG ITEM", id);
  // update our items array without this one
  let newItems = items.filter((item) => item.ID !== id);
  items = [...newItems];
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}
function markAsComplete(id) {
  let targetItem = items.findIndex((item) => item.ID == id);
  items[targetItem].complete = !items[targetItem].complete;
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}
// -------------------------------------------------------
shoppingForm.addEventListener("submit", handleSubmit);
// We can bind more than one eventHandler to a specific event same is below:
list.addEventListener("itemsUpdated", displayItems);
list.addEventListener("itemsUpdated", mirrorToLocalStorage);
list.addEventListener("click", (e) => {
  // Here, target is a button and currentTarget is the list
  const id = parseInt(e.target.value);
  if (e.target.matches("button")) {
    deleteItem(id);
  }
  if (e.target.matches("input")) {
    markAsComplete(id);
  }
  return;
});
// -------------------------------------------------------

restoreFromLocalStorage();

// That was a lot, but that is how all of those frameworks work.
// You basically have some state, you write a bunch of handlers
// to update state and to modify it, filter it, change it.
// When that state changes, you re-render out the HTML that is on the page.
