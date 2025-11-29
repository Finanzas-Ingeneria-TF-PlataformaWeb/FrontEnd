// src/api/configApi.js
// API de configuración financiera (modo localStorage demo)

const STORAGE_KEY = 'mv_financial_config_v1'

const defaultConfig = {
    general: {
        defaultCurrency: 'PEN',
        allowPEN: true,
        allowUSD: true
    },
    rates: {
        defaultRateType: 'effective', // effective | nominal
        defaultEffectiveAnnualRate: 10.5,
        defaultNominalAnnualRate: 11.0,
        defaultNominalCapitalization: 'monthly' // monthly, bimonthly, quarterly, semiannual, annual
    },
    terms: {
        minYears: 5,
        maxYears: 25,
        maxTotalGraceMonths: 12,
        maxPartialGraceMonths: 24
    },
    subsidy: {
        allowed: true,
        minAmount: 0,
        maxAmount: 40000
    }
}

function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return { ...defaultConfig }
        const parsed = JSON.parse(raw)
        return {
            general: { ...defaultConfig.general, ...(parsed.general || {}) },
            rates: { ...defaultConfig.rates, ...(parsed.rates || {}) },
            terms: { ...defaultConfig.terms, ...(parsed.terms || {}) },
            subsidy: { ...defaultConfig.subsidy, ...(parsed.subsidy || {}) }
        }
    } catch (err) {
        return { ...defaultConfig }
    }
}

function saveToStorage(config) {
    const merged = {
        general: { ...defaultConfig.general, ...(config.general || {}) },
        rates: { ...defaultConfig.rates, ...(config.rates || {}) },
        terms: { ...defaultConfig.terms, ...(config.terms || {}) },
        subsidy: { ...defaultConfig.subsidy, ...(config.subsidy || {}) }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    return merged
}

export function getFinancialConfig() {
    return new Promise((resolve) => {
        const config = loadFromStorage()
        resolve({ data: config })
    })
}

export function saveFinancialConfig(payload) {
    return new Promise((resolve) => {
        const saved = saveToStorage(payload)
        resolve({ data: saved })
    })
}

export function resetFinancialConfig() {
    return new Promise((resolve) => {
        const saved = saveToStorage(defaultConfig)
        resolve({ data: saved })
    })
}
