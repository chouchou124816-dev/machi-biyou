// Supabase の URL と anon key を直書き
const supabaseUrl = "https:///kgijjigjnxppivqlpvqv.supabase.co";
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
}

loadShops();
