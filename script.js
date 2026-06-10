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
}

loadShops();
