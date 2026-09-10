/* ============================================================
   共有データソース
   index.html / balance.html / transactions.html から参照し、
   残高の数字が全ページで一致するようにするための簡易モックデータ。
   実際のシステムに組み込む際は、ここをAPI呼び出し結果に置き換える。
   ============================================================ */

const BANK_ACCOUNT = {
  branchName: "さくら支店",
  branchNo: "101",
  accountNo: "1234567",
  futsuBalance: 5623937,   // 円普通預金
  hybridBalance: 0,        // ハイブリッド預金
  prevMonthDiff: -9115,    // 前月末比
  get totalBalance() {
    return this.futsuBalance + this.hybridBalance;
  },
};

function formatYen(n) {
  const sign = n < 0 ? "-" : "";
  return sign + Math.abs(n).toLocaleString("ja-JP");
}

function formatNowJP() {
  const d = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
