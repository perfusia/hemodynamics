import type { Ref } from '../../ui/Cite'
import { COMMON } from '../../content/refs'

const L1 = {
  vincent2013: {
    key: 'vincent2013', kind: 'article', authors: 'Vincent, J.-L., & De Backer, D.', short: 'Vincent & De Backer', year: '2013',
    title: 'Circulatory shock',
    container: 'New England Journal of Medicine', volume: '369', issue: '18', pages: '1726–1734', doi: '10.1056/NEJMra1208943',
  },
  asfar2014: {
    key: 'asfar2014', kind: 'article',
    authors: 'Asfar, P., Meziani, F., Hamel, J.-F., Grelon, F., Megarbane, B., Anguel, N., Mira, J.-P., Dequin, P.-F., Gergaud, S., Weiss, N., Legay, F., Le Tulzo, Y., Conrad, M., Robert, R., Gonzalez, F., Guitton, C., Tamion, F., Tonnelier, J.-M., Guezennec, P., … Radermacher, P.',
    short: 'Asfar et al.', year: '2014',
    title: 'High versus low blood-pressure target in patients with septic shock',
    container: 'New England Journal of Medicine', volume: '370', issue: '17', pages: '1583–1593', doi: '10.1056/NEJMoa1312173',
  },
  leone2015: {
    key: 'leone2015', kind: 'article', authors: 'Leone, M., Asfar, P., Radermacher, P., Vincent, J.-L., & Martin, C.', short: 'Leone et al.', year: '2015',
    title: 'Optimizing mean arterial pressure in septic shock: A critical reappraisal of the literature',
    container: 'Critical Care', volume: '19', pages: 'Article 101', doi: '10.1186/s13054-015-0794-z',
  },
  meng2018: {
    key: 'meng2018', kind: 'article', authors: 'Meng, L., Yu, W., Wang, T., Zhang, L., Heerdt, P. M., & Gelb, A. W.', short: 'Meng et al.', year: '2018',
    title: 'Blood pressure targets in perioperative care: Provisional considerations based on a comprehensive literature review',
    container: 'Hypertension', volume: '72', issue: '4', pages: '806–817', doi: '10.1161/HYPERTENSIONAHA.118.11688',
  },
  razminia2004: {
    key: 'razminia2004', kind: 'article',
    authors: 'Razminia, M., Trivedi, A., Molnar, J., Elbzour, M., Guerrero, M., Salem, Y., Ahmed, A., Khosla, S., & Lubell, D. L.',
    short: 'Razminia et al.', year: '2004',
    title: 'Validation of a new formula for mean arterial pressure calculation: The new formula is superior to the standard formula',
    container: 'Catheterization and Cardiovascular Interventions', volume: '63', issue: '4', pages: '419–425', doi: '10.1002/ccd.20217',
  },
} satisfies Record<string, Ref>

export const R1 = { ...COMMON, ...L1 }

export const L1_REFS: Ref[] = [
  R1.hall2025, R1.guyton1955, R1.magder2016, R1.vincent2013, R1.asfar2014, R1.leone2015, R1.meng2018, R1.razminia2004,
]
