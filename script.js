// Netlify に設定した環境変数を読み込む
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase クライアントを作成
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 接続確認（デバッグ用）
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
}

// 関数を実行
loadShops();

