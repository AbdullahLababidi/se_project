let loadMoreBtn = document.querySelector('#load-more');
let currentItem = 6; // Initialize to show 6 items initially
loadMoreBtn.onclick = () => {
  let boxes = [...document.querySelectorAll('.container .box-container .box')];
  let itemsToLoad = 6; // Load 3 items per click

  for (let i = currentItem; i < currentItem + itemsToLoad; i++) {
    boxes[i].style.display = 'inline-block';
  }

  currentItem += itemsToLoad;

  if (currentItem >= boxes.length) {
    loadMoreBtn.style.display = 'none'; // Hide the button if all items are loaded
  }
};