export default function orderedList(
  listItems: string[],
  orderedClass?: string,
  listitemsClass?: string
) {
  const ol = document.createElement("ol");
  ol.classList.add(orderedClass || "ordered-list");

  listItems.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = item;
    li.classList.add(listitemsClass || "list-item");
    ol.appendChild(li);
  });

  return ol;
}
