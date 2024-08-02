interface listItem {
  btnName: string;
  btnClass: string;
  btnFunction: () => void;
}

export default function listBtns(listItems: listItem[], listClass?: string) {
  const ul = document.createElement("ul");

  if (listClass) {
    ul.classList.add(listClass);
  }

  listItems.forEach((item) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.innerHTML = item.btnName;
    if (item.btnClass) {
      btn.classList.add(item.btnClass);
    }
    btn.addEventListener("click", item.btnFunction);
    li.appendChild(btn);
    ul.appendChild(li);
  });

  return ul;
}
