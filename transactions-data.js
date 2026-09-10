/* ============================================================
   入出金明細のモックデータ
   ------------------------------------------------------------
   ・すべて架空の取引（実在の個人・団体とは無関係）
   ・最終残高（時系列で一番新しい取引後の残高）は shared-data.js の
     BANK_ACCOUNT.futsuBalance と自動的に一致するよう、
     このファイルの中で逆算して計算する（数字を二重管理しない）
   ・のちほど実際のスプレッドシートに置き換える場合は、
     sheet-data.js 経由で取得した行をこの配列と同じ形
     { date, category, name, amount } に変換すればよい
   ============================================================ */

// カテゴリごとの表示名・色・アイコン
const TXN_CATEGORIES = {
  atm: { label: "ATM", color: "#2fb0c9", icon: "atm" },
  debit: { label: "口座振替", color: "#7b6ff0", icon: "calendar" },
  transferIn: { label: "振込", color: "#39b76d", icon: "arrowDown" },
  transferOut: { label: "振込", color: "#3f7fd6", icon: "arrowUp" },
  internal: { label: "普通　円", color: "#f0824a", icon: "cardSwap" },
  salary: { label: "給与", color: "#39b76d", icon: "star" },
  tax: { label: "税金", color: "#e0637a", icon: "tax" },
  interest: { label: "利息", color: "#39b76d", icon: "coin" },
  other: { label: "取引", color: "#9a9a9a", icon: "doc" },
};

// { date: "YYYY-MM-DD", category, name, amount(円, 入金+ / 出金-) }
const MOCK_LEDGER = [
  // ---- 4月 ---- (収入 300,150 / 支出 135,000)
  { date: "2026-04-03", category: "salary", name: "給与＊カブシキガイシャサンプル", amount: 300000 },
  { date: "2026-04-07", category: "atm", name: "ＡＴＭ　サンプル銀行", amount: -30000 },
  { date: "2026-04-15", category: "debit", name: "口座振替　サンプル電力", amount: -45000 },
  { date: "2026-04-25", category: "transferOut", name: "振込＊サンプル　タロウ", amount: -60000 },
  { date: "2026-04-28", category: "interest", name: "利息", amount: 150 },

  // ---- 5月 ---- (収入 375,000 / 支出 180,000)
  { date: "2026-05-03", category: "salary", name: "給与＊カブシキガイシャサンプル", amount: 295000 },
  { date: "2026-05-10", category: "debit", name: "口座振替　サンプルガス", amount: -50000 },
  { date: "2026-05-16", category: "tax", name: "地方税", amount: -60000 },
  { date: "2026-05-20", category: "transferIn", name: "振込＊サンプル　ハナコ", amount: 80000 },
  { date: "2026-05-27", category: "atm", name: "ＡＴＭ　サンプル銀行", amount: -70000 },

  // ---- 6月 ---- (収入 305,140 / 支出 185,000)
  { date: "2026-06-03", category: "salary", name: "給与＊カブシキガイシャサンプル", amount: 305000 },
  { date: "2026-06-09", category: "debit", name: "口座振替　サンプル通信", amount: -40000 },
  { date: "2026-06-14", category: "internal", name: "普通　円　サンプル", amount: -90000 },
  { date: "2026-06-21", category: "transferOut", name: "振込＊サンプル　ジロウ", amount: -55000 },
  { date: "2026-06-28", category: "interest", name: "利息", amount: 140 },

  // ---- 7月 ---- (収入 410,000 / 支出 190,000)
  { date: "2026-07-03", category: "salary", name: "給与＊カブシキガイシャサンプル", amount: 290000 },
  { date: "2026-07-08", category: "atm", name: "ＡＴＭ　サンプル銀行", amount: -55000 },
  { date: "2026-07-15", category: "debit", name: "口座振替　サンプル保険", amount: -70000 },
  { date: "2026-07-22", category: "internal", name: "普通　円　サンプル", amount: 120000 },
  { date: "2026-07-29", category: "tax", name: "国税", amount: -65000 },

  // ---- 8月 ---- (収入 530,180 / 支出 344,000。1年でいちばん出入りが多い月)
  { date: "2026-08-03", category: "salary", name: "給与＊カブシキガイシャサンプル", amount: 330000 },
  { date: "2026-08-07", category: "atm", name: "ＡＴＭ　サンプルセブン", amount: -45000 },
  { date: "2026-08-10", category: "debit", name: "口座振替　サンプル信販", amount: -120000 },
  { date: "2026-08-14", category: "transferOut", name: "振込＊サンプル　ケイコ", amount: -35000 },
  { date: "2026-08-16", category: "interest", name: "利息", amount: 180 },
  { date: "2026-08-16", category: "tax", name: "国税", amount: -6000 },
  { date: "2026-08-16", category: "tax", name: "地方税", amount: -3000 },
  { date: "2026-08-25", category: "transferIn", name: "振込＊サンプルショウテン", amount: 140000 },
  { date: "2026-08-26", category: "internal", name: "普通　円　サンプル", amount: -40000 },
  { date: "2026-08-27", category: "debit", name: "口座振替　サンプル住宅", amount: -95000 },
  { date: "2026-08-31", category: "internal", name: "普通　円　サンプル", amount: 60000 },

  // ---- 9月（当月・進行中）---- (収入 300,300 / 支出 85,000)
  { date: "2026-09-01", category: "salary", name: "給与＊カブシキガイシャサンプル", amount: 285000 },
  { date: "2026-09-03", category: "debit", name: "口座振替　サンプル電力", amount: -60000 },
  { date: "2026-09-05", category: "atm", name: "ＡＴＭ　サンプルセブン", amount: -25000 },
  { date: "2026-09-07", category: "transferIn", name: "振込＊サンプル　タロウ", amount: 15300 },
];

// スプレッドシートの「カテゴリ」列（日本語）→ アイコン用の内部キー
const CATEGORY_LABEL_TO_KEY = {
  "ATM": "atm",
  "口座振替": "debit",
  "振込入金": "transferIn",
  "振込出金": "transferOut",
  "口座間": "internal",
  "給与": "salary",
  "税金": "tax",
  "利息": "interest",
  "その他": "other",
};

function mapCategoryLabel(label) {
  return CATEGORY_LABEL_TO_KEY[String(label || "").trim()] || "other";
}

// 「カテゴリ」列が無い銀行CSVでも、内容の文字列からアイコンを推測する
function inferCategoryFromText(description, amount) {
  const t = String(description || "");
  if (/ａｔｍ|atm/i.test(t)) return "atm";
  if (/口座振替/.test(t)) return "debit";
  if (/給与/.test(t)) return "salary";
  if (/振込/.test(t)) return amount >= 0 ? "transferIn" : "transferOut";
  if (/利息/.test(t)) return "interest";
  if (/地方税|国税|税/.test(t)) return "tax";
  if (/普通/.test(t)) return "internal";
  return "other";
}

// カテゴリ列があればそれを使い、無ければ内容から自動推測する
function resolveCategory(rawLabel, description, amount) {
  const trimmed = String(rawLabel || "").trim();
  if (trimmed && CATEGORY_LABEL_TO_KEY[trimmed]) return CATEGORY_LABEL_TO_KEY[trimmed];
  return inferCategoryFromText(description, amount);
}

// "2026/09/07" や "2026-9-7" のような表記を "2026-09-07" に揃える
function normalizeDate(raw) {
  const parts = String(raw || "").trim().split(/[\/\-]/);
  if (parts.length !== 3) return String(raw || "");
  const [y, m, d] = parts;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// 時系列(昇順)に並べ替えて残高を付与する。
// ・行ごとに残高が分かっていればそれを優先し、空欄は「直前の残高＋今回の金額」で補完する
// ・1行も残高が無ければ、最終残高(既定では shared-data.js の futsuBalance)から逆算する
function buildLedgerFromEntries(entries, options = {}) {
  const sorted = [...entries]
    .map((e) => ({ ...e, date: normalizeDate(e.date) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const hasAnyBalance = sorted.some((e) => e.balance !== null && e.balance !== undefined);

  if (hasAnyBalance) {
    const balances = sorted.map((e) => (e.balance !== null && e.balance !== undefined ? e.balance : null));

    // 前方向：分かっている残高をもとに、後ろの空欄を埋める
    for (let i = 1; i < balances.length; i++) {
      if (balances[i] === null && balances[i - 1] !== null) {
        balances[i] = balances[i - 1] + sorted[i].amount;
      }
    }
    // 後方向：先頭側がまだ空欄なら、最初に分かった残高から逆算して埋める
    for (let i = balances.length - 2; i >= 0; i--) {
      if (balances[i] === null && balances[i + 1] !== null) {
        balances[i] = balances[i + 1] - sorted[i + 1].amount;
      }
    }
    return sorted.map((e, i) => ({ ...e, balance: balances[i] }));
  }

  const targetFinalBalance = options.targetFinalBalance ?? BANK_ACCOUNT.futsuBalance;
  const totalDelta = sorted.reduce((sum, t) => sum + t.amount, 0);
  let running = targetFinalBalance - totalDelta; // 最初の取引が始まる直前の残高
  return sorted.map((t) => {
    running += t.amount;
    return { ...t, balance: running };
  });
}

// 初期値はサンプルデータ。sheet-config.js に公開スプレッドシートのURLが
// 設定されていれば、ページ側でこの LEDGER を実データで作り直す（transactions.html参照）
let LEDGER = buildLedgerFromEntries(MOCK_LEDGER);

// index.html（ホーム）・balance.html（残高照会）・transactions.html（入出金明細）の
// どの画面でも「現在残高（円普通預金）」がまったく同じ値になるよう、この関数だけを
// 唯一の計算経路にする。スプレッドシートが未設定・取得失敗時はサンプルデータ
// (MOCK_LEDGER) から計算し、shared-data.js の値とも一致させる。
async function computeCurrentFutsuBalance() {
  const sheetRows = await fetchTransactionsFromSheet();
  let ledger;
  if (sheetRows && sheetRows.length) {
    const entries = sheetRows.map((r) => ({
      date: r.date,
      category: resolveCategory(r.category, r.description, r.amount),
      name: r.description,
      amount: r.amount,
      balance: r.balance,
    }));
    ledger = buildLedgerFromEntries(entries);
  } else {
    ledger = buildLedgerFromEntries(MOCK_LEDGER);
  }
  const last = ledger[ledger.length - 1];
  return last ? last.balance : null;
}

// "2026-08-31" -> { year: 2026, month: 8 }
function ymKey(dateStr) {
  const [y, m] = dateStr.split("-").map(Number);
  return y * 100 + m;
}

function monthLabel(year, month) {
  return `${month}月`;
}

// 台帳に登場する年月の一覧（昇順）
function listAvailableMonths() {
  const keys = new Set(LEDGER.map((t) => ymKey(t.date)));
  return [...keys].sort((a, b) => a - b).map((k) => ({ year: Math.floor(k / 100), month: k % 100 }));
}

function transactionsForMonth(year, month) {
  return LEDGER.filter((t) => {
    const [y, m] = t.date.split("-").map(Number);
    return y === year && m === month;
  }).sort((a, b) => b.date.localeCompare(a.date)); // 新しい順
}

function monthlyTotals(year, month) {
  const rows = transactionsForMonth(year, month);
  const income = rows.filter((r) => r.amount > 0).reduce((s, r) => s + r.amount, 0);
  const expense = rows.filter((r) => r.amount < 0).reduce((s, r) => s - r.amount, 0);
  return { income, expense };
}

// カテゴリごとのアイコン（線画・currentColor）
const TXN_ICON_PATHS = {
  atm:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9v6M8 9l-2.3 2M8 9l2.3 2"/><path d="M16 15V9M16 15l-2.3-2M16 15l2.3-2"/>',
  calendar:
    '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
  arrowDown: '<path d="M12 5v13M12 18l-5-5M12 18l5-5"/>',
  arrowUp: '<path d="M12 19V6M12 6l-5 5M12 6l5 5"/>',
  cardSwap:
    '<rect x="3" y="4.5" width="12" height="8.5" rx="1.6"/><rect x="9" y="11" width="12" height="8.5" rx="1.6" fill="#fff" stroke="currentColor"/><path d="M13 15.2h5"/>',
  star:
    '<path d="M12 3l2.5 5.6L20 9.3l-4.3 4.1 1 5.9L12 16.6l-4.7 2.7 1-5.9L4 9.3l5.5-.7z" fill="currentColor" stroke="none"/>',
  tax: '<rect x="8" y="4" width="8" height="16" rx="4"/><path d="M8 12h8"/>',
  coin: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10a2.4 2.4 0 0 1 5 0M9.5 14a2.4 2.4 0 0 0 5 0" />',
  doc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
};

function renderTxnIcon(category) {
  const meta = TXN_CATEGORIES[category] || TXN_CATEGORIES.other;
  const path = TXN_ICON_PATHS[meta.icon] || TXN_ICON_PATHS.doc;
  return `
    <span class="txn-icon" style="background:${meta.color}">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        ${path}
      </svg>
    </span>`;
}
