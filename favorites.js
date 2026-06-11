// Supabase 接続
const supabaseUrl = "https://kgijijgjnxppiqvlpqvq.supabase.co";
const supabaseKey = "sb_publishable_ioB0JGLtDtJrH-WyAYluaw_654cHGwP";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// localStorage からお気に入りIDを取得
function loadFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

async function loadFavoriteShops() {
  const favs = loadFavorites();
  if (favs.length === 0) {
    document.getElementById("favorite-list").innerHTML = "<p>お気に入りはありません。</p>";
    return;
  }

  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .in("id", favs);

  if (error) {
    console.error(error);
    return;
  }

  const list = document.getElementById("favorite-list");
  list.innerHTML = "";

  data.forEach(shop => {
    const div = document.createElement("div");
    div.className = "shop-card";
    div.innerHTML = `
      <img src="${shop.image_url}" alt="${shop.name}">
      <h2>${shop.name}</h2>
      <p>${shop.address}</p>
      <p>${shop.description}</p>
    `;
    list.appendChild(div);
  });
}

loadFavoriteShops();
