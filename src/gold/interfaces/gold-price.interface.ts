export interface GoldPriceData {
  row: string;
  name: string;
  type: string;
  purity: string;
  buyPrice: number;
  sellPrice: number;
  timestamp: string;
}

export interface BTMCDataItem {
  '@row': string;
  '@n_1': string;
  '@k_1': string;
  '@h_1': string;
  '@pb_1': string;
  '@ps_1': string;
  '@pt_1': string;
  '@d_1': string;
  [key: string]: string; // Cho phép các key động khác
}

export interface BTMCResponse {
  DataList: {
    Data: BTMCDataItem[];
  };
} 