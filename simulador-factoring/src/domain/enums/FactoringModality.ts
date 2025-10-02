export enum FactoringModality {
  WITH_RECOURSE = 'WITH_RECOURSE',           // Com regresso - conventional
  WITHOUT_RECOURSE = 'WITHOUT_RECOURSE',     // Sem regresso - conventional
  MATURITY = 'MATURITY',                     // Maturity factoring - no advance, payment guarantee
  TRUSTEE = 'TRUSTEE',                       // Trustee - full financial admin
  INTERNATIONAL = 'INTERNATIONAL',           // International factoring
  RAW_MATERIAL = 'RAW_MATERIAL'             // Factoring de matéria prima
}
