import DexieInstance from "@/plugins/dexie";
import ChartService from "@/service/ChartService";
import UrlService from "@/service/UrlService";
import TipService from '@/service/TipService'

import x2js from 'x2js';

const dexieInstance = new DexieInstance();

export const urlService = new UrlService(dexieInstance.getUrl());
export const chartService = new ChartService(dexieInstance.getChart());
export const tipService = new TipService(dexieInstance.getTip());

export const json2xml = new x2js({
    selfClosingElements: false,
    escapeMode: false
});