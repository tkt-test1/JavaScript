// async_data_processor.js

class AsyncDataProcessor {
  /**
   * 外部APIをシミュレートする非同期関数
   * 実際のAPIリクエストの代わりにPromiseとsetTimeoutを使用
   * @param {string} endpoint - APIのエンドポイントを模倣する文字列
   * @param {any} data - 返すデータ
   * @param {number} delay - 遅延時間（ミリ秒）
   * @returns {Promise<any>}
   */
  static mockFetch(endpoint, data, delay) {
    console.log(`[START] データ取得中: ${endpoint}`);
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`[DONE] データ取得完了: ${endpoint}`);
        resolve(data);
      }, delay);
    });
  }

  /**
   * 複数のAPIエンドポイントからデータを並行して取得
   * @param {string[]} endpoints - 取得するエンドポイントの配列
   * @returns {Promise<any[]>} - 取得したデータの配列
   */
  static async fetchAllData(endpoints) {
    const promises = endpoints.map(endpoint => {
      // 実際はここでfetch(endpoint)などを使う
      // 今回はモックAPIを呼び出す
      return this.mockFetch(endpoint, { data: `Data from ${endpoint}` }, Math.random() * 1000 + 500);
    });

    // Promise.allを使って、全ての非同期処理が完了するのを待つ
    return Promise.all(promises);
  }

  /**
   * 取得したデータを集計する高階関数
   * @param {function} aggregator - 集計ロジックを定義する関数
   * @returns {function(any[]): any} - データを集計する関数
   */
  static createAggregator(aggregator) {
    return (data) => aggregator(data);
  }
}

// --- 実行例 ---

// APIエンドポイントのリストを定義
const apiEndpoints = [
  "api/users",
  "api/products",
  "api/orders"
];

// 集計ロジックを定義
const countDataItems = (data) => {
  console.log("--- 集計処理 ---");
  return data.length;
};

// 高階関数を使って集計関数を生成
const myAggregator = AsyncDataProcessor.createAggregator(countDataItems);

// メインの非同期処理を実行
(async () => {
  console.log("=== 全データ取得と集計を開始 ===");
  try {
    // 複数のデータを並行して取得
    const results = await AsyncDataProcessor.fetchAllData(apiEndpoints);
    console.log("全データの取得が完了しました:", results);

    // 取得したデータを集計
    const totalItems = myAggregator(results);
    console.log(`集計結果: 取得したデータセットの総数は ${totalItems} 個です。`);

  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    console.log("=== 処理を終了 ===");
  }
})();
