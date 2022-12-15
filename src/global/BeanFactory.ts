import DexieInstance from "@/plugins/dexie";
import ChartService from "@/service/ChartService";
import UrlService from "@/service/UrlService";
import TipService from '@/service/TipService'

import x2js from 'x2js';
import {useDark, useToggle} from "@vueuse/core";

const dexieInstance = new DexieInstance();

export const urlService = new UrlService(dexieInstance.getUrl());
export const chartService = new ChartService(dexieInstance.getChart());
export const tipService = new TipService(dexieInstance.getTip());

export const json2xml = new x2js({
    selfClosingElements: false,
    escapeMode: false
});

export const isDark = useDark({
    initialValue: "light",
    selector: 'body',
    attribute: 'theme-mode',
    valueDark: 'dark',
    valueLight: 'light',
});
export const toggleDark = useToggle(isDark);