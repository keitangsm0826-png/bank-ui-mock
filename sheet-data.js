/* ============================================================
   Googleスプレッドシート（公開CSV）読み取りユーティリティ
   ------------------------------------------------------------
   sheet-config.js の csvUrl が設定されていれば、そこから明細行を
   取得して配列で返す。未設定・取得失敗時は null を返すので、
   呼び出し側は shared-data.js のモック値にフォールバックすること。
   ============================================================ */

// settings.html でこの端末のブラウザに保存したURL（localStorage）があれば
// そちらを最優先で使う。無ければ sheet-config.js の csvUrl を使う。
// こうしておくことで、csvUrl自体はコードに書かずに済み、公開リポジトリに
// アップロードしても実際のスプレッドシートURLが外部に漏れない。
const SHEET_URL_STORAGE_KEY = "miraiBank.sheetCsvUrl";

function getEffectiveCsvUrl() {
  try {
    const saved = window.localStorage.getItem(SHEET_URL_STORAGE_KEY);
    if (saved) return saved;
  } catch (err) {
    // localStorageが使えない環境（プライベートブラウズ等）は無視してフォールバック
  }
  return SHEET_CONFIG.csvUrl;
}

async function fetchTransactionsFromSheet() {
  const csvUrl = getEffectiveCsvUrl();
  if (!csvUrl) return null;

  try {
    const res = await fetch(csvUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    return parseCSV(text);
  } catch (err) {
    console.warn(
      "スプレッドシートの取得に失敗しました。ローカルのモックデータを使用します。",
      err
    );
    return null;
  }
}

// 見出し比較を緩くする（全角/半角カッコ・空白・「(円)」の有無を無視して比較）
function normalizeHeader(h) {
  return String(h || "")
    .trim()
    .replace(/[（(]\s*円\s*[）)]/g, "")
    .replace(/\s+/g, "");
}

function findColumn(headers, name) {
  if (!name) return -1;
  const target = normalizeHeader(name);
  return headers.findIndex((h) => normalizeHeader(h) === target);
}

// シート1行分を { 日付, 内容, カテゴリ(生の文字列), 金額(数値), 残高(数値 or null) } の配列に変換。
// 「金額」列が無い場合は「出金金額」「入金金額」の2列（入金-出金）から金額を計算する。
function parseCSV(text) {
  const lines = text.replace(/\r/g, "").trim().split("\n");
  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]).map((h) => h.trim());
  const col = SHEET_CONFIG.columns;
  const idx = {
    date: findColumn(headers, col.date),
    description: findColumn(headers, col.description),
    category: findColumn(headers, col.category),
    amount: findColumn(headers, col.amount),
    debit: findColumn(headers, col.debit),
    credit: findColumn(headers, col.credit),
    balance: findColumn(headers, col.balance),
  };

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const cells = splitCSVLine(line);
      const balanceRaw = idx.balance >= 0 ? cells[idx.balance] : "";

      let amount;
      if (idx.amount >= 0) {
        amount = toNumber(cells[idx.amount]);
      } else {
        const debitVal = idx.debit >= 0 ? toNumber(cells[idx.debit]) : 0;
        const creditVal = idx.credit >= 0 ? toNumber(cells[idx.credit]) : 0;
        amount = creditVal - debitVal;
      }

      return {
        date: idx.date >= 0 ? (cells[idx.date] || "").trim() : "",
        description: idx.description >= 0 ? (cells[idx.description] || "").trim() : "",
        category: idx.category >= 0 ? (cells[idx.category] || "").trim() : "",
        amount,
        balance: balanceRaw.trim() === "" ? null : toNumber(balanceRaw),
      };
    });
}

function toNumber(raw) {
  const n = parseInt(String(raw).replace(/[^0-9-]/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}

// ダブルクォート・カンマを含むCSV行に対応する簡易パーサー
function splitCSVLine(line) {
  const result = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      result.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

// シートの最新行の残高（無ければ金額列の合計）を返す。取得できなければ null。
async function fetchLatestBalanceFromSheet() {
  const rows = await fetchTransactionsFromSheet();
  if (!rows || rows.length === 0) return null;

  const last = rows[rows.length - 1];
  if (last.balance !== null && last.balance !== undefined) {
    return last.balance;
  }
  return rows.reduce((sum, r) => sum + r.amount, 0);
}
