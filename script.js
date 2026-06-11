// Supabase の URL と anon key を直書き
const supabaseUrl = "https://kgijijgjnxppiqvlpqvq.supabase.co";
const supabaseKey = "sb_publishable_ioB0JGLtDtJrH-WyAYluaw_654cHGwP";

// Supabase クライアントを作成
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 接続確認
console.log("Supabase 接続完了:", supabaseUrl);

// shops テーブルからデータを取得する関数
async function loadShops() {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error("データ取得エラー:", error);
    return;
  }

  console.log("取得したデータ:", data);

  // ▼▼ ここから追加（必ず loadShops の中） ▼▼
  const list = document.getElementById("shop-list");
  list.innerHTML = ""; // 初期化

  data.forEach(shop => {
    const div = document.createElement("div");
    div.className = "shop-card";
    div.innerHTML = `
  <img src="${shop.image_url}" alt="${shop.name}">
  <h2>${shop.name}</h2>
  <p>${shop.address}</p>
  <p>${shop.description}</p>

  <div class="btn-area">
    ${shop.map_url ? `<a class="btn" href="${shop.map_url}" target="_blank">📍 Google Maps</a>` : ""}
    ${shop.reserve_url ? `<a class="btn" href="${shop.reserve_url}" target="_blank">📅 予約する</a>` : ""}
    ${shop.homepage_url ? `<a class="btn" href="${shop.homepage_url}" target="_blank">🏠 ホームページ</a>` : ""}
  </div>

  <div class="favorite" data-id="${shop.id}">♡</div>
`;

    list.appendChild(div);
  });
  // ▲▲ ここまで追加 ▲▲
}

loadShops();

// --- お気に入り保存用 localStorage ---
function loadFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function saveFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}

// --- ハートの状態を反映 ---
function applyFavoriteState() {
  const favs = loadFavorites();
  document.querySelectorAll(".favorite").forEach(fav => {
    const id = fav.dataset.id;
    if (favs.includes(id)) {
      fav.classList.add("active");
      fav.textContent = "❤️";
    } else {
      fav.textContent = "♡";
    }
  });
}

// --- ハートクリックイベント ---
document.addEventListener("click", e => {
  if (!e.target.classList.contains("favorite")) return;

  const id = e.target.dataset.id;
  let favs = loadFavorites();

  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }

  saveFavorites(favs);
  applyFavoriteState();
});

// 初期反映
applyFavoriteState();
