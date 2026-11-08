export type Company = {
  id: string;
  name: string;
};

export type RegisteredCompany = Company & {
  responsibleName: string;
  email: string;
  status: 'pending' | 'approved';
  requestedAt: string;
  approvedAt?: string;
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
