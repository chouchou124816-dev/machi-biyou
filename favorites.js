// Supabase 接続
const supabaseUrl = "https://kgijijgjnxppiqvlpqvq.supabase.co";
const supabaseKey = "sb_publishable_ioB0JGLtDtJrH-WyAYluaw_654cHGwP";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

async function loadFavoriteShops() {
  const user = await getCurrentUser();
  const container = document.getElementById("favorite-list");

  if (!user) {
    container.innerHTML = "<p>ログインするとお気に入りが表示されます。</p>";
    return;
  }

  // ① favorites から shop_id を取得
  const { data: favs, error: favError } = await supabase
    .from("favorites")
    .select("shop_id")
    .eq("user_id", user.id);

  if (favError) {
    console.error(favError);
    container.innerHTML = "<p>お気に入りの取得に失敗しました。</p>";
    return;
  }

  if (!favs || favs.length === 0) {
    container.innerHTML = "<p>お気に入りはまだありません。</p>";
    return;
  }

  const ids = favs.map(f => f.shop_id);

  // ② shops テーブルから店舗情報を取得
  const { data: shops, error: shopError } = await supabase
    .from("shops")
    .select("*")
    .in("id", ids);

  if (shopError) {
    console.error(shopError);
    container.innerHTML = "<p>店舗情報の取得に失敗しました。</p>";
    return;
  }

  container.innerHTML = "";

  shops.forEach(shop => {
    const div = document.createElement("div");
    div.className = "shop-card";
    div.innerHTML = `
      <img src="${shop.image_url}" alt="${shop.name}">
      <h2>${shop.name}</h2>
      <p>${shop.address}</p>
      <p>${shop.description}</p>
    `;
    container.appendChild(div);
  });
}

loadFavoriteShops();