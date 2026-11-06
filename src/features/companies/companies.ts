export type Company = {
  id: string;
  name: string;
};

export const companies: Company[] = [
  { id: 'nimbus-analytics', name: 'Nimbus Analytics' },
  { id: 'orbita-sistemas', name: 'Órbita Sistemas' },
  { id: 'pixel-lab', name: 'Pixel Lab' },
  { id: 'conecta-ti', name: 'Conecta TI' },
];

export function getCompanyById(id: string) {
  return companies.find((company) => company.id === id);
}
