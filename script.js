// Netlify に設定した環境変数を読み込む
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase クライアントを作成
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 接続確認（デバッグ用）
console.log("Supabase 接続完了:", supabaseUrl);
