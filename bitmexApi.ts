const WS_URL =
  "wss://www.bitmex.com/realtime?subscribe=trade:XBTUSD,liquidation:XBTUSD";

export class BitmexClient {
  private sellData: Array<[number, number]> = [];
  private buyData: Array<[number, number]> = [];
  private sizeData: Array<[number, number]> = [];

  constructor(onUpdate: (data: any) => void) {
    setInterval(() => {
      this.pruneOldTrades();
      onUpdate(this.getData()); // todo: only call this when underlying data has changed
    }, 1000);
    this.setupWebsocket();
  }

  private setupWebsocket() {
    const ws = new WebSocket(WS_URL);
    ws.addEventListener("error", e => {
      console.log("api error", e); // todo: handle this gracefully. Log, retry e.t.c.
    });
    ws.addEventListener("message", e => this.onMessage(e));
  }

  private onMessage(e: { data: string }) {
    const obj = JSON.parse(e.data);
    const { table, action } = obj;
    if (table === "trade" && action === "insert") {
      // todo: handle other payloads
      const trade = BitmexClient.processTrade(obj);
      this.addTrade(trade);
    }
  }

  private getData() {
    const { sellData, buyData, sizeData } = this;

    return {
      sellData: [...sellData],
      buyData: [...buyData],
      sizeData: [...sizeData]
    };
  }

  private addTrade(trade: Trade) {
    console.log(trade);
    const { timestamp, price, size, side } = trade;
    this.sizeData.push([timestamp, size]);
    if (side === "Sell") {
      this.sellData.push([timestamp, price]);
    } else {
      this.buyData.push([timestamp, price]);
    }
  }

  public pruneOldTrades() {
    console.time("prune");

    const now = Date.now();
    const oldestAllowedAge = now - 1000 * 60;

    function prune(arr: Array<[number, number]>) {
      for (let i = arr.length - 1; i >= 0; i--) {
        const timestamp = arr[i][0];
        if (timestamp < oldestAllowedAge) {
          arr.splice(i, 1);
        }
      }
    }

    prune(this.sellData);
    prune(this.buyData);
    prune(this.sizeData);

    console.timeEnd("prune");
  }

  static processTrade(tradeRaw): Trade {
    let sizeTotal = 0;
    let priceTotal = 0;

    tradeRaw.data.forEach(item => {
      // Unsure if this is correct
      sizeTotal += item.size;
      priceTotal += item.price;
    });

    return {
      // These two values seem to be consistent with sibling elements.
      // Reading from the first element should be sufficient
      timestamp: Date.parse(tradeRaw.data[0].timestamp),
      side: tradeRaw.data[0].side,

      size: sizeTotal,
      price: priceTotal
    };
  }
}

interface Trade {
  timestamp: number;
  size: number;
  price: number;
  side: "Buy" | "Sell";
}
