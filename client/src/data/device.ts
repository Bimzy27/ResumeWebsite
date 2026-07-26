import type { DevicePart } from '../types'

// Specs for the PC shown in the Device section: Branden's actual build
// (PCPartPicker list au.pcpartpicker.com/list/bH2pC8, cross-checked against
// the running hardware). The ids are stable and map 1:1 to the proxy meshes
// in DeviceModel.vue, so only the label/spec text should change here.

// Branden's Amazon Associates tracking tag (Store ID), shared with books.ts.
const ASSOCIATES_TAG = 'brandenimmerz-20'

// Amazon search results link rather than a direct product page: parts don't
// have a stable, hand-verified ASIN the way the book ISBNs do, and a wrong
// ASIN would send a click to a completely unrelated product. The tag param
// still carries through onto the results page for Associates tracking.
function amazonSearch(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${ASSOCIATES_TAG}`
}

export const deviceParts: DevicePart[] = [
  {
    id: 'cpu',
    label: 'CPU',
    spec: 'Intel Core Ultra 7 265K - 20 cores (8P + 12E), up to 5.5 GHz',
    amazonUrl: amazonSearch('Intel Core Ultra 7 265K'),
  },
  {
    id: 'gpu',
    label: 'GPU',
    spec: 'ASUS Dual GeForce RTX 5060 Ti OC - 16GB GDDR7',
    amazonUrl: amazonSearch('ASUS Dual GeForce RTX 5060 Ti OC 16GB'),
  },
  {
    id: 'ram',
    label: 'Memory',
    spec: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5-6000 CL36',
    amazonUrl: amazonSearch('Corsair Vengeance RGB 32GB DDR5-6000 CL36'),
  },
  {
    id: 'motherboard',
    label: 'Motherboard',
    spec: 'MSI Z890 Gaming Plus WiFi - ATX, LGA1851',
    amazonUrl: amazonSearch('MSI Z890 Gaming Plus WiFi motherboard'),
  },
  {
    id: 'storage',
    label: 'Storage',
    spec: 'Crucial T705 2TB NVMe PCIe 5.0 (up to 14,500 MB/s) + TeamGroup MP44 512GB NVMe secondary',
    amazonUrl: amazonSearch('Crucial T705 2TB NVMe SSD'),
  },
  {
    id: 'cooling',
    label: 'Cooling',
    spec: 'Noctua NH-D9L dual-tower air cooler',
    amazonUrl: amazonSearch('Noctua NH-D9L CPU cooler'),
  },
  {
    id: 'psu',
    label: 'PSU',
    spec: 'MSI MAG A750GL PCIE5 - 750W 80+ Gold, fully modular',
    amazonUrl: amazonSearch('MSI MAG A750GL PCIE5 750W power supply'),
  },
  {
    id: 'case',
    label: 'Case',
    spec: 'Phanteks XT Pro ATX mid-tower',
    amazonUrl: amazonSearch('Phanteks XT Pro ATX case'),
  },
]
