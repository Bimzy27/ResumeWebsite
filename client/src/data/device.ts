import type { DevicePart } from '../types'

// Specs for the PC shown in the Device section.
// PLACEHOLDER DATA: Branden will supply the real part list (and the real 3D
// model) in a follow-up task; swap these entries then. The ids are stable and
// map 1:1 to the proxy meshes in DeviceModel.vue, so only the label/spec text
// should need updating.
export const deviceParts: DevicePart[] = [
  { id: 'cpu', label: 'CPU', spec: 'AMD Ryzen 7 7800X3D - 8 cores / 16 threads' },
  { id: 'gpu', label: 'GPU', spec: 'NVIDIA GeForce RTX 4070 SUPER - 12GB GDDR6X' },
  { id: 'ram', label: 'Memory', spec: '32GB (2x16GB) DDR5-6000' },
  { id: 'motherboard', label: 'Motherboard', spec: 'B650 ATX' },
  { id: 'storage', label: 'Storage', spec: '2TB NVMe PCIe 4.0 SSD' },
  { id: 'cooling', label: 'Cooling', spec: '240mm AIO liquid cooler' },
  { id: 'psu', label: 'PSU', spec: '750W 80+ Gold, fully modular' },
  { id: 'case', label: 'Case', spec: 'Mid-tower ATX, tempered glass' },
]
