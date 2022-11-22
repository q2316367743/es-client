import DexieInstance from "@/plugins/dexie";
import ChartService from "@/service/ChartService";
import UrlService from "@/service/UrlService";
import TipService from '@/service/TipService'

const dexieInstance = new DexieInstance();

export const urlService = new UrlService(dexieInstance.getUrl())
export const chartService = new ChartService(dexieInstance.getChart())
export const tipService = new TipService(dexieInstance.getTip())