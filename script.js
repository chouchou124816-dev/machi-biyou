console.log("script.js 読み込みOK");

// Supabase の URL と anon key を直書き
const supabaseUrl = "https://kgijijgjnxppiqvlpqvq.supabase.co";
const supabaseKey = "sb_publishable_ioB0JGLtDtJrH-WyAYluaw_654cHGwP";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase 接続完了:", supabaseUrl);

// ------------------------------
// 1. ログイン中ユーザー取得
// ------------------------------
async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  console.log("現在のユーザー:", data);
  if (error || !data.user) return null;
  return data.user;
}

// ------------------------------
// 2. ユーザーのお気に入り一覧を取得
// ------------------------------
async function fetchUserFavorites() {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("favorites")
    .select("shop_id")
    .eq("user_id", user.id);

  if (error) {
    console.error("お気に入り取得エラー:", error);
    return [];
  }

  return data.map(row => String(row.shop_id));
}

// ------------------------------
// 3. ハートの状態を反映
// ------------------------------
async function applyFavoriteState() {
  console.log("applyFavoriteState 実行");
  const favIds = await fetchUserFavorites();

  document.querySelectorAll(".favorite").forEach(fav => {
    const id = fav.dataset.id;
    if (favIds.includes(id)) {
      fav.classList.add("active");
      fav.textContent = "❤️";
    } else {
      fav.classList.remove("active");
      fav.textContent = "♡";
    }
  });
}

// ------------------------------
// 4. 店舗一覧を読み込む
// ------------------------------
async function loadShops() {
  console.log("loadShops 実行開始");

  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .order('id', { ascending: true });

  console.log("取得したデータ:", data);

  if (error) {
    console.error("データ取得エラー:", error);
    return;
  }

  const list = document.getElementById("shop-list");
  list.innerHTML = "";

  data.forEach(shop => {
    const div = document.createElement("div");
    div.className = "shop-card";

    div.innerHTML = `
      <div class="photo-area">
        ${shop.photos && shop.photos.length > 0
        ? shop.photos.map(url => `<img src="${url}" alt="${shop.name}">`).join("")
        : `<img src="${shop.image_url}" alt="${shop.name}">`
      }
      </div>

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

  // ハートの状態を反映
  await applyFavoriteState();
}

loadShops();

// ------------------------------
// 5. ハートクリック（Supabase 保存）
// ------------------------------
document.addEventListener("click", async e => {
  if (!e.target.classList.contains("favorite")) return;

  const user = await getCurrentUser();

  if (!user) {
    alert("お気に入りを使うにはログインが必要です");
    return;
  }

  const shopId = Number(e.target.dataset.id);
  console.log("ハートクリック:", shopId);

  // すでにお気に入りか確認
  const { data: exists } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("shop_id", shopId)
    .maybeSingle();

  if (exists) {
    // 削除
    await supabase
      .from("favorites")
      .delete()
      .eq("id", exists.id);
  } else {
    // 追加
    await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        shop_id: shopId
      });
  }

  // 表示更新
  await applyFavoriteState();
});

async function updateLoginLink() {
  const { data } = await supabase.auth.getUser();
  const link = document.getElementById("loginLink");

  if (data.user) {
    link.textContent = "マイページ";
    link.href = "mypage.html";
  } else {
    link.textContent = "ログイン";
    link.href = "login.html";
  }
}

updateLoginLink();

// ------------------------------
// 店舗を登録する（owner_id を付ける）
// ------------------------------
async function addShop() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    alert("ログインしてください");
    return;
  }

  const name = document.getElementById("shop-name").value;
  const address = document.getElementById("shop-address").value;
  const description = document.getElementById("shop-description").value;

  const { data, error } = await supabase
    .from("shops")
    .insert({
      name: name,
      address: address,
      description: description,
      owner_id: user.id
    })
    .select();

  console.log("登録結果 data:", data);
  console.log("登録結果 error:", error);

  if (error) {
    console.error(error);
    alert("登録エラー: " + error.message);
  } else {
    alert("店舗を登録しました！");
  }
}

