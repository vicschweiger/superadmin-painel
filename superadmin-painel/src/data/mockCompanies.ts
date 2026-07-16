import type { Company } from '../types/company.ts';

export const mockCompanies: Company[] = [
  {
    id: '2A6G3D',
    access_token: '2A6G3D',
    name: 'Pizzaria Bella Napoli',
    client_name: 'Giovanni Rossi',
    client_email: 'giovanni@bellanapoli.com',
    client_phone: '11987654321',
    client_cpf: '123.456.789-00',
    payment_status: 'active',
    expiry_date: '2024-12-31',
    modules: {
      catalog_mode: true, // Ajustamos para o nome correto
      store_mode: false   // Adicionamos o outro campo obrigatório
    },
    module_ecommerce: true,
    module_reservations: true,
    gtm_container_id: 'GTM-XXXXXX'
  },
  {
    id: '8B4H9K',
    access_token: '8B4H9K',
    name: 'Hamburgueria Smash',
    client_name: 'Juliana Silva',
    client_email: 'juliana@smash.com',
    client_phone: '21912345678',
    client_cpf: '987.654.321-99',
    payment_status: 'pending',
    expiry_date: '2024-08-15',
    modules: {
      catalog_mode: true, // Ajustamos para o nome correto
      store_mode: false   // Adicionamos o outro campo obrigatório
    },
    module_ecommerce: false,
    module_reservations: false,
  },
  {
    id: '5C1J7M',
    access_token: '5C1J7M',
    name: 'Sushi House',
    client_name: 'Kenji Tanaka',
    client_email: 'kenji@sushihouse.jp',
    client_phone: '41955558888',
    client_cpf: '456.789.123-11',
    payment_status: 'suspended',
    expiry_date: '2024-07-01',
    module_catalog: false,
    module_ecommerce: false,
    module_reservations: false,
  },
];