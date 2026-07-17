import type { DevicePart } from '../types'

// Specs for the PC shown in the Device section: Branden's actual build
// (PCPartPicker list au.pcpartpicker.com/list/bH2pC8, cross-checked against
// the running hardware). The ids are stable and map 1:1 to the proxy meshes
// in DeviceModel.vue, so only the label/spec text should change here.
export const deviceParts: DevicePart[] = [
  { id: 'cpu', label: 'CPU', spec: 'Intel Core Ultra 7 265K - 20 cores (8P + 12E), up to 5.5 GHz' },
  { id: 'gpu', label: 'GPU', spec: 'ASUS Dual GeForce RTX 5060 Ti OC - 16GB GDDR7' },
  { id: 'ram', label: 'Memory', spec: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5-6000 CL36' },
  { id: 'motherboard', label: 'Motherboard', spec: 'MSI Z890 Gaming Plus WiFi - ATX, LGA1851' },
  { id: 'storage', label: 'Storage', spec: 'Crucial T705 2TB NVMe PCIe 5.0 - up to 14,500 MB/s' },
  { id: 'cooling', label: 'Cooling', spec: 'Noctua NH-D9L dual-tower air cooler' },
  { id: 'psu', label: 'PSU', spec: 'MSI MAG A750GL PCIE5 - 750W 80+ Gold, fully modular' },
  { id: 'case', label: 'Case', spec: 'Phanteks XT Pro ATX mid-tower' },
]
